/* eslint-disable prettier/prettier */
import {
  Injectable,
  HttpStatus,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserInterface, UserBody, UserStatus } from './user.types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Raw, Repository } from 'typeorm';
import { ConfirmationService } from 'src/confirmation/confirmation.service';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { ConfirmationStatus } from 'src/confirmation/confirmation.types';
import { UserRoleService } from 'src/userRole/userRole.service';
import { UserRoleName } from 'src/userRole/userRole.types';
import { UserRole } from 'src/userRole/userRole.entity';
import { hash } from 'bcrypt';
import { StorageService } from 'src/storage/storage.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { StatisticsService } from 'src/statistics/statistics.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly confirmationService: ConfirmationService,
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly statisticsService: StatisticsService,
    private readonly userRoleService: UserRoleService,
    private readonly storageService: StorageService,
    private readonly jwtService: JwtService,
  ) {}
  //!функция для того чтобы загрузить из excel users START
  async createAccounts(buffer: Buffer): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      throw new Error('Рабочий лист не был загружен или не доступен');
    }
    const rows = [];

    worksheet.eachRow((row) => {
      rows.push(row.values);
    });

    for (const row of rows) {
      const [t, code, fio, phone] = row;
      let coder = code;
      let phones = String(phone);

      try {
        if (code === undefined) {
          coder = 'B0001';
          console.log(coder);
        }
        if (phones === undefined) {
          phones = '0';
          console.log(phones);
          continue;
        }
        const normalizedPhone = typeof phones === 'string' ? phones : '';
        // console.log(phones);

        const password = typeof phones === 'string' ? phones.slice(-6) : '';
        const user = await this.userRepository.save({
          status: 1,
          personal_code: code.replace('One-', ''),
          name: fio || '',
          phone: normalizedPhone,
          password: password,
          email: code,
          dateOfBirth: '',
          residenceCity: '',
        });
        // console.log(user);

        console.log('--------------');
      } catch (err) {
        console.log(fio);
        console.log(err);
        continue;
      }
    }
  }
  //!функция для того чтобы загрузить из excel users END

  //!функция для того чтобы обновить users  из excel  START

  async updateAccounts(buffer: Buffer): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      throw new Error('Рабочий лист не был загружен или не доступен');
    }
    const rows = [];

    worksheet.eachRow((row) => {
      rows.push(row.values);
    });

    for (const row of rows) {
      const [t, code, fio, phone] = row;
      const phones = String(phone);

      try {
        if (code === undefined) {
          console.log('Код пользователя отсутствует');
          continue;
        }
        const userToUpdate = await this.userRepository.findOne({
          where: {
            email: code.replace('One-', ''),
          },
        });

        if (!userToUpdate) {
          console.log(`Пользователь с кодом ${code} не найден`);
          continue;
        }
        if (phones === undefined) {
          console.log('Телефон пользователя отсутствует');
          continue;
        }
        // console.log(phones);

        const password = typeof phones === 'string' ? phones.slice(-6) : '';
        const hashedPassword = await hash(password, 10);

        // userToUpdate.name = fio || userToUpdate.name;
        userToUpdate.password = hashedPassword;
        // userToUpdate.email = code.replace('One-', '');

        await this.userRepository.save(userToUpdate);

        console.log('Данные пользователя обновлены');
      } catch (err) {
        console.log(fio);
        console.log(err);
        continue;
      }
    }
    console.log('END--------------------------------------------------------');
  }
  //!функция для того чтобы обновить users из excel  END
  async getThreeMonthStatistic(id: string): Promise<any> {
    return await this.statisticsService.generateStatisticsThreeMonthForUser(id);
  }
  onApplicationBootstrap() {
    // this.createAdm()
  }
  async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    const hashedNewPassword = await hash(newPassword, 10);

    await this.userRepository.update(userId, { password: hashedNewPassword });
  }
  async forForgetPassCreateCode(email: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const emailConfirmation =
        await this.confirmationService.createEmailConfirmation();
      user.emailConfirmation = emailConfirmation;
      await this.userRepository.save(user);
      await this.mailerService.sendMail({
        to: user.email,
        from: this.configService.get<string>('EMAIL'),
        subject: 'Код для восстановления пароля!',
        text: `Ваш код для восстановления: ${emailConfirmation.code}`,
        html: '',
      });
    } catch (error) {
      throw new Error(`Failed to create confirmation code: ${error.message}`);
    }
  }
  async forForgetCodeCreateCode(email: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const emailConfirmation =
        await this.confirmationService.createEmailConfirmation();
      user.emailConfirmation = emailConfirmation;
      await this.userRepository.save(user);
      await this.mailerService.sendMail({
        to: user.email,
        from: this.configService.get<string>('EMAIL'),
        subject: 'Новый код!',
        text: `Новый код для регистрации: ${emailConfirmation.code}`,
        html: '',
      });
    } catch (error) {
      throw new Error(`Failed to create confirmation code: ${error.message}`);
    }
  }

  async checkCode(email: string, code: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { emailConfirmation: true },
    });
    console.log(user);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.emailConfirmation.code !== code) {
      throw new BadRequestException('Invalid confirmation code');
    }
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { emailConfirmation: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.emailConfirmation.code !== code) {
      throw new BadRequestException('Invalid confirmation code');
    }
    const hashedPassword = await hash(newPassword, 10);
    await this.userRepository.update(user.id, { password: hashedPassword });
  }
  async createAdm() {
    const exist = await this.userRepository.findOne({
      where: {
        personal_code: 'U000',
      },
    });
    if (!exist) {
      const user = new User();
      user.personal_code = 'U000';
      user.name = 'admin';
      user.surname = 'admin';
      user.phone = '+9';
      user.email = 'admin';
      user.dateOfBirth = new Date().toDateString();
      user.residenceCity = 'Bishkek';
      user.status = UserStatus.ACTIVE;
      user.password = 'Asiali19B';
      this.userRepository.save(user);
    }
  }

  findAll() {
    return [{ id: 1, name: 'Max' }];
  }

  async generateStatisticsForUser(user: User, month: number) {
    return await this.statisticsService.generateStatisticsForUser(user, month);
  }

  // async changePassword(userId: string, newPassword: string): Promise<void> {
  //   const hashedPassword = await hash(newPassword, 10);
  //   await this.userRepository.update(userId, { password: hashedPassword });
  // }

  async changePasswordByEmail(
    email: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = await hash(newPassword, 10);
    await this.userRepository.update(user.id, { password: hashedPassword });
  }

  async findUsersByRole(
    roleName: UserRoleName,
    statuses: UserStatus[],
  ): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect(
        'user.roles',
        'user_role',
        'user_role.roleName = :roleName AND user.status in (:...statuses)',
        { roleName, statuses },
      )
      .getMany();
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['emailConfirmation', 'storage', 'products'],
    });
  }

  async findByCode(code: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        personal_code: code,
      },
      relations: ['emailConfirmation', 'storage', 'products'],
    });
  }

  async addUsersToFirstShop(buffer: Buffer): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);

    const rows = [];

    worksheet.eachRow((row, rowNumber) => {
      rows.push(row.values);
    });

    const storage = await this.storageService.findById(
      '89858e75-391f-4650-aa25-981e711581ed',
    );

    for (let i = 0; i < rows.length; i++) {
      const [, code, name, personal_code] = rows[i];
      const user = await this.userRepository.save({
        name: name,
        surname: '-',
        personal_code: code,
        phone: typeof personal_code === 'string' ? personal_code : '-',
        dateOfBirth: '-',
        residenceCity: '-',
        email: code,
        password: '123456',
        status: UserStatus.ACTIVE,
        storage: storage,
      });
      console.log(user);

      // console.log(product)
      console.log('-------------');
    }
  }

  async findAllByStorageId(id: string, res: Response) {
    console.log(id);
    console.log('TEST');
    const users = await this.userRepository.find({
      order: {
        dateCreated: 'DESC',
      },
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
      { header: 'Personal Code', key: 'personal_code', width: 15 },
      { header: 'Name', key: 'name', width: 10 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Residence', key: 'residenceCity', width: 20 },
      { header: 'Date Created', key: 'dateCreated', width: 20 },
    ];

    users.forEach((user) => {
      const { name, personal_code, email, phone, residenceCity, dateCreated } =
        user;
      worksheet.addRow({
        name,
        personal_code,
        email,
        phone,
        residenceCity,
        dateCreated,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="users.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
    return null;
  }

  async findAllByUsersCodeExists(letter: string, res: Response) {
    const storages = await this.userRepository.find({
      order: {
        dateCreated: 'DESC',
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
      { header: 'Personal Code', key: 'personal_code', width: 15 },
      { header: 'Name', key: 'name', width: 10 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Residence', key: 'residenceCity', width: 20 },
      { header: 'Date Created', key: 'dateCreated', width: 20 },
    ];

    for (let i = 0; i < storages.length; i++) {
      if (storages[i].personal_code.includes(letter)) {
        console.log('TEST');

        const {
          name,
          personal_code,
          email,
          phone,
          residenceCity,
          dateCreated,
        } = storages[i];
        worksheet.addRow({
          name,
          personal_code,
          email,
          phone,
          residenceCity,
          dateCreated,
        });
      }
    }
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="users.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();

    return null;
  }

  async findAllByStorage(num: number) {
    const storages = await this.storageService.findAll();
    if (num === 1) {
      return this.userRepository.find({
        where: {
          storage: storages[0],
        },
      });
    } else {
      return this.userRepository.find({
        where: {
          storage: storages[1],
        },
      });
    }
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findByPersonalCode(personal_code: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        personal_code,
      },
      relations: {
        storage: true,
      },
    });
  }

  private generateUser(body: UserBody): User {
    const user = new User();
    user.name = body.name;
    user.surname = body.surname;
    user.phone = body.phone;
    user.dateOfBirth = body.dateOfBirth;
    user.residenceCity = body.residenceCity;
    user.email = body.email.toLowerCase();
    user.status = UserStatus.ON_CHECK;
    return user;
  }

  private async checkExistingRole(role: UserRoleName): Promise<UserRole> {
    const userRole = await this.userRoleService.findRoleByRoleName(role);

    if (!userRole) {
      throw new HttpException(
        'User role doesnt exist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return userRole;
  }

  async createUser(body: CreateUserInterface): Promise<any> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: body.email,
      },
    });
    if (existingUser) {
      return 400;
    }
    const userRole = await this.checkExistingRole(body.role.roleName);
    const activeStorage = await this.storageService.getActiveStorage();

    const user = this.generateUser(body);
    user.password = body.password;
    user.roles = [userRole];
    user.storage = activeStorage;

    /* Сюда надо внедрить алгоритм создания personal_code*/
    const lastUser = await this.userRepository.find({
      order: { dateCreated: 'DESC' },
      take: 1,
    });

    let newCode = 'One-B0300';
    if (lastUser[0] && lastUser[0].personal_code) {
      const { prefix, number } = this.splitCode(lastUser[0].personal_code);

      if (number < 9999) {
        newCode = `${prefix}${this.padNumber(number + 1)}`;
      } else {
        const nextPrefix = this.nextChar(prefix);
        newCode = `${nextPrefix}0001`;
      }
    }
    console.log(newCode);
    user.personal_code = newCode;

    const emailConfirmation =
      await this.confirmationService.createEmailConfirmation();
    user.emailConfirmation = emailConfirmation;
    const createdUser = await this.userRepository.save(user);
    await this.mailerService.sendMail({
      to: user.email,
      from: this.configService.get<string>('EMAIL'),
      subject: 'Пожалуйста, подтвердите вашу электронную почту!',
      text: `Ваш код подтверждения: ${emailConfirmation.code}`,
      html: '',
    });

    const payload = { email: user.email, id: user.id };
    return {
      user: createdUser,
      access_token: this.jwtService.sign(payload, { secret: 'AZAT' }),
    };
  }
  // async createUser(body: CreateUserInterface): Promise<any> {
  //   const existingUser = await this.userRepository.findOne({
  //     where: {
  //       email: body.email,
  //     },
  //   });
  //   if (existingUser) {
  //     return 400;
  //   }

  //   const userRole = await this.checkExistingRole(body.role.roleName);

  //   const activeStorage = await this.storageService.getActiveStorage();

  //   const user = this.generateUser(body);
  //   user.password = body.password;
  //   user.roles = [userRole];
  //   user.storage = activeStorage;

  //   const cityCode = body.residenceCity[0].toUpperCase();

  //   const existingCodes = await this.userRepository.find({
  //     where: {
  //       personal_code: Raw((alias) => `${alias} LIKE '${cityCode}%'`),
  //     },
  //     order: {
  //       personal_code: 'DESC',
  //     },
  //     take: 1,
  //   });

  //   let counter = 1;
  //   if (existingCodes.length > 0) {
  //     const lastCodeNumber = parseInt(existingCodes[0].personal_code.slice(-4));
  //     counter = lastCodeNumber + 1;
  //   }

  //   const newCode = `${cityCode}${this.padNumber(counter)}`;
  //   user.personal_code = newCode;

  //   const emailConfirmation =
  //     await this.confirmationService.createEmailConfirmation();
  //   user.emailConfirmation = emailConfirmation;

  //   const createdUser = await this.userRepository.save(user);

  //   await this.mailerService.sendMail({
  //     to: user.email,
  //     from: this.configService.get<string>('EMAIL'),
  //     subject: 'Пожалуйста, подтвердите вашу электронную почту!',
  //     text: `Ваш код подтверждения: ${emailConfirmation.code}`,
  //     html: '',
  //   });

  //   const payload = { email: user.email, id: user.id };
  //   return {
  //     user: createdUser,
  //     access_token: this.jwtService.sign(payload, { secret: 'AZAT' }),
  //   };
  // }

  private splitCode(code: string): { prefix: string; number: number } {
    const match = code.match(/^([A-Z]+)(\d+)$/);
    if (!match) throw new InternalServerErrorException('Invalid code format.');

    return {
      prefix: match[1],
      number: parseInt(match[2], 10),
    };
  }

  private padNumber(num: number): string {
    return num.toString().padStart(4, '0');
  }

  private nextChar(c: string): string {
    const nextCharCode = c.charCodeAt(0) + 1;
    // Здесь вы можете добавить проверку, чтобы вернуться к 'A', если достигнут 'Z'
    return String.fromCharCode(nextCharCode);
  }

  async confirmUserEmail(userId: string, code: string) {
    const user = await this.findById(userId);
    const emailConfirmation =
      await this.confirmationService.confirmEmailConfirmation(
        code,
        user.emailConfirmation,
      );

    switch (emailConfirmation.confirmationStatus) {
      case ConfirmationStatus.PENDING: {
        throw new HttpException(
          `Code is incorrect, you have ${emailConfirmation.attempts} attempts`,
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      case ConfirmationStatus.DECLINED: {
        throw new HttpException(
          'You dont have no attempts anymore, register new email',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      case ConfirmationStatus.ACTIVATED: {
        await this.userRepository.update(userId, { status: UserStatus.ACTIVE });
        return await this.findById(userId);
      }
    }
  }

  async registerNewUserEmail(userId: string, email: string) {
    const user = await this.findById(userId);
    if (
      user.status === UserStatus.DELETED ||
      user.status === UserStatus.INACTIVE
    ) {
      throw new HttpException(
        'User is inactive or was deleted',
        HttpStatus.FORBIDDEN,
      );
    }
    try {
      await this.confirmationService.closeConfirmation(
        user.emailConfirmation.id,
      );
      const emailConfirmation =
        await this.confirmationService.createEmailConfirmation();
      await this.userRepository.update(user.id, { email, emailConfirmation });
      const updatedUser = await this.findById(user.id);
      await this.mailerService.sendMail({
        to: updatedUser.email,
        from: this.configService.get<string>('EMAIL'),
        subject: 'Пожалуйста, подтвердите вашу электронную почту!',
        text: `Ваш код подтверждения: ${emailConfirmation.code}`,
        html: '',
      });
      return updatedUser;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createSuperAdmin(body: UserBody) {
    const superAdminRole = await this.checkExistingRole(
      UserRoleName.SUPER_ADMIN,
    );

    const existingSuperAdmin = await this.findUsersByRole(
      UserRoleName.SUPER_ADMIN,
      [UserStatus.ON_CHECK, UserStatus.ACTIVE],
    );

    if (existingSuperAdmin.length) {
      throw new HttpException(
        'SuperAdmin User already exist',
        HttpStatus.FORBIDDEN,
      );
    }

    const superAdmin = await this.generateUser(body);
    const randomPassword = (await hash(Math.random().toString(), 3)).slice(
      0,
      8,
    );
    superAdmin.password = randomPassword;
    console.log('random pass: ', randomPassword);
    superAdmin.roles = [superAdminRole];

    const createdSuperAdmin = await this.userRepository.save(superAdmin);

    await this.mailerService.sendMail({
      to: superAdmin.email,
      from: this.configService.get<string>('EMAIL'),
      subject: 'Please confirm your email!',
      text: `Your password is: ${randomPassword}, enter your password to activate your account`,
      html: '',
    });

    return createdSuperAdmin;
  }

  /* TODO: Create method to change super admin email */
  //   async changeSuperAdminEmail() {}
  /* TODO *********************************************/

  /* TODO: Resend password to super admin email */
  //   async resendSuperAdminPassword() {}
  /* TODO ***************************************/

  async confirmSuperAdminAccountByPassword(userId: string) {
    await this.userRepository.update(userId, { status: UserStatus.ACTIVE });
    return this.findById(userId);
  }
}

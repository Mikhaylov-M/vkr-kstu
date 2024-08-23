/* eslint-disable prettier/prettier */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserInterface, UserBody, UserStatus } from './user.types';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import { UserRoleName } from 'src/userRole/userRole.types';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post('test/add')
  @UseInterceptors(FileInterceptor('file'))
  async createStatuses(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const accounts = await this.userService.createAccounts(file.buffer);
    res.json(accounts);
  }
  @UseGuards(JwtAuthGuard)
  @Post('test/update')
  @UseInterceptors(FileInterceptor('file'))
  async updateStatuses(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const accounts = await this.userService.updateAccounts(file.buffer);
    res.json(accounts);
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  getUserInfo(
    @Request()
    { user },
  ) {
    return this.userService.findById(user.id);
  }
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.userService.findByCode(code);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id/statistics/:month')
  async generateStatisticsForUser(
    @Param('id') userId: string,
    @Param('month') month: number,
  ) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.userService.generateStatisticsForUser(user, month);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('shop/:id')
  async findAllByShop(
    @Param('id')
    id: string,
    @Res()
    res: Response,
  ) {
    return this.userService.findAllByStorageId(id, res);
  }

  @Get('shop/letter/:id')
  async findAllByShopLetter(
    @Param('id')
    id: string,
    @Res()
    res: Response,
  ) {
    return this.userService.findAllByUsersCodeExists(id, res);
  }

  @Post()
  async createUser(@Body() body: CreateUserInterface): Promise<User> {
    return await this.userService.createUser(body);
  }
  @UseGuards(JwtAuthGuard)
  @Post('changePass/:id')
  async changeUserPassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ): Promise<any> {
    try {
      await this.userService.updateUserPassword(id, newPassword);
      return { message: 'Пароль успешно изменен!' };
    } catch (error) {
      return {
        message: 'Failed to update password',
        error: error.message,
      };
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('confirm/:code')
  async confirmUserEmail(
    @Param('code')
    code: string,
    @Request()
    { user },
  ) {
    return await this.userService.confirmUserEmail(user.id, code);
  }
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    await this.userService.forForgetPassCreateCode(email);
    return { message: 'Code sent to email' };
  }
  @Post('forgot-code')
  async forgotCode(@Body('email') email: string) {
    await this.userService.forForgetCodeCreateCode(email);
    return { message: 'Code sent to email' };
  }

  @Post('check-code/:email')
  async checkCode(@Param('email') email: string, @Body('code') code: string) {
    await this.userService.checkCode(email, code);
    return { message: 'Code is valid' };
  }

  @Post('reset-password/:email')
  async resetPassword(
    @Param('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string,
  ) {
    await this.userService.resetPassword(email, code, newPassword);
  }
  
  @Get('three-month/:id')
  async getThreeMonth(@Param('id') id: string) {
    return await this.userService.getThreeMonthStatistic(id);
  }
  @Post('update/password/email/:email')
  async changePasswordByEmail(
    @Param('email') email: string,
    @Body('newPassword') newPassword: string,
  ) {
    return await this.userService.changePasswordByEmail(email, newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update/email/:email')
  async registerNewEmail(
    @Param('email')
    email: string,
    @Request()
    { user },
  ) {
    return await this.userService.registerNewUserEmail(user.id, email);
  }

  @Get('/test')
  async test() {
    return await this.userService.findUsersByRole(UserRoleName.USER, [
      UserStatus.ACTIVE,
      UserStatus.ON_CHECK,
    ]);
  }

  @Post('super-admin')
  async createNewSuperAdmin(@Body() user: UserBody) {
    return await this.userService.createSuperAdmin(user);
  }

  @Post('add')
  @UseInterceptors(FileInterceptor('file'))
  async addNewUsersToFirstShop(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const data = await this.userService.addUsersToFirstShop(file.buffer);
    res.json(data);
  }
}

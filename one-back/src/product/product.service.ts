/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { UserService } from 'src/user/user.service';
import { ProductStatus } from './product.types';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly userService: UserService,
  ) {}

  async findById(id: string): Promise<Product> {
    return this.productRepository.findOne({
      where: {
        id,
      },
    });
  }

  // async findProductByHatch(hatch: string) {
  //   return this.productRepository.findOne({
  //     where: {
  //       hatch,
  //     },
  //   });
  // }

  async findProductByTrackCode(trackCode: string) {
    return this.productRepository.findOne({
      where: {
        trackCodeOfTheProduct: trackCode,
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }
  async uploadCnExcelPartOne(buffer: Buffer, createdAt: string): Promise<any> {
    const createdAtDate = new Date(createdAt);
    console.log(createdAtDate);
    if (isNaN(createdAtDate.getTime())) {
      throw new Error('Неверный формат даты создания.');
    }

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

    const dataToProcess = rows; //slice(5)

    for (const row of dataToProcess) {
      const [, , userCode, trackCodeOfTheProduct] = row; //  , ,, usercode , track
      console.log('ds');

      console.log(userCode);
      console.log(trackCodeOfTheProduct);

      if (!userCode || !trackCodeOfTheProduct) {
        continue;
      }
      try {
        let code = String(userCode);
        code = code.replace('ONE-', '');
        if (code.length === 1) {
          code = '000' + code;
        }
        if (code.length === 2) {
          code = '00' + code;
        }
        if (code.length === 3) {
          code = '0' + code;
        }
        if (code.length === 4) {
          code = code;
        }
        const userCodeToSave = String(userCode).includes('B')
          ? String(userCode)
          : `B${code}`;

        const trackCodeOfTheProductCheck = trackCodeOfTheProduct
          ? trackCodeOfTheProduct
          : '';

        const existingProduct = await this.productRepository.findOne({
          where: { trackCodeOfTheProduct: trackCodeOfTheProductCheck },
        });

        const user = await this.userService.findByCode(userCodeToSave);
        if (existingProduct) {
          existingProduct.dateCreated = createdAtDate;
          await this.productRepository.save(existingProduct);
          console.log(
            `Продукт с track code ${trackCodeOfTheProductCheck} уже существует.`,
          );
          continue;
        }
        console.log(user);

        const product = await this.productRepository.save({
          status: ProductStatus.IN_STORAGE,
          userCode: userCodeToSave,
          trackCodeOfTheProduct: String(trackCodeOfTheProductCheck),
          user: user ? user : null,
          dateCreated: createdAtDate,
        });
        console.log(product);

        console.log('--------------');
      } catch (err) {
        console.log(err);
        continue;
      }
    }
  }

  async uploadKgExcelPartOne(buffer: Buffer, createdAt: string): Promise<any> {
    const createdAtDate = new Date(createdAt);
    if (isNaN(createdAtDate.getTime())) {
      throw new Error('Неверный формат даты создания.');
    }
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);

    const rows = [];

    worksheet.eachRow((row) => {
      rows.push(row.values);
    });

    for (let i = 0; i < rows.length; i++) {
      const [, , , kod, trackCodeOfTheProduct, , weight, , , dolTotal] =
        rows[i];
      console.log(trackCodeOfTheProduct);
      console.log(weight);
      console.log(dolTotal);

      if (!trackCodeOfTheProduct || !weight || !dolTotal) {
        continue;
      }

      try {
        let product = await this.productRepository.findOne({
          where: { trackCodeOfTheProduct },
        });

        if (!product) {
          product = await this.productRepository.create({
            trackCodeOfTheProduct,
            dateCreated: createdAtDate,
            status: ProductStatus.DELIVERED,
            weight: String(weight) || '0',
            deliveryCost: this.roundToTwoDecimalPlaces(dolTotal.result),
          });
        } else {
          await this.productRepository.update(
            { trackCodeOfTheProduct },
            {
              weight: String(weight) || '0',
              deliveryCost: this.roundToTwoDecimalPlaces(dolTotal.result),
            },
          );
        }

        console.log(product);
        console.log('-----------------');
      } catch (err) {
        console.log(err);
        continue;
      }
    }
  }
  private roundToTwoDecimalPlaces(value) {
    return Math.round(value * 100) / 100;
  }
  @Cron(CronExpression.EVERY_HOUR)
  async updateStatuses() {
    const twelveHoursAgo = new Date(Date.now() - 12 * 3600 * 1000);
    await this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ status: ProductStatus.ON_THE_WAY })
      .where('dateCreated <= :twelveHoursAgo', { twelveHoursAgo })
      .andWhere('status != :delivered', { delivered: ProductStatus.DELIVERED })
      .andWhere('status != :onTheWay', { onTheWay: ProductStatus.ON_THE_WAY })
      .execute();
  }
}

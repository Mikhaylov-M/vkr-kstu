/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Statistics } from './entities/statistic.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Statistics, Product, User])], // add this line
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryLevel, Statistics } from './entities/statistic.entity';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private statisticsRepository: Repository<Statistics>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async generateStatisticsForUser(user: User, month: number) {
    // Фильтрация продуктов по указанному месяцу
    const productsForMonth = user?.products.filter(
      (product) => product.dateCreated.getMonth() + 1 === month,
    );

    // Удаление продуктов без веса или стоимости доставки
    const filteredProducts = productsForMonth.filter(
      (product) => product.weight !== null && product.deliveryCost !== null,
    );

    const totalOrders = filteredProducts.length || 0;

    // Суммарный вес всех продуктов
    let totalWeight = 0;
    filteredProducts.forEach((product) => {
      const weight = parseFloat(product.weight);
      if (!isNaN(weight)) {
        totalWeight += weight;
      }
    });
    const roundedTotalWeight = parseFloat(totalWeight.toFixed(2));

    // Общая стоимость доставки
    const totalDeliveryCost = filteredProducts.reduce(
      (acc, product) => acc + product.deliveryCost,
      0,
    );
    const totalCost = parseFloat(totalDeliveryCost.toFixed(2));

    // Определение уровня доставки на основе суммарного веса
    let deliveryLevel: DeliveryLevel;
    if (totalWeight >= 1000) {
      deliveryLevel = DeliveryLevel.Platinum;
    } else if (totalWeight >= 500) {
      deliveryLevel = DeliveryLevel.Gold;
    } else {
      deliveryLevel = DeliveryLevel.Standard;
    }

    // Проверка, есть ли существующая статистика для пользователя за данный месяц
    const statistics = await this.statisticsRepository.findOne({
      where: {
        personal_code: user?.personal_code,
        month,
      },
    });

    if (statistics) {
      statistics.total_orders = totalOrders;
      statistics.total_weight = roundedTotalWeight;
      statistics.total_paid = totalCost;
      statistics.deliveryLevel = deliveryLevel;

      return await this.statisticsRepository.save(statistics);
    } else {
      // Создание новой статистики, если не существует
      const newStatistic = this.statisticsRepository.create({
        personal_code: user.personal_code,
        user,
        month,
        total_orders: totalOrders,
        total_weight: roundedTotalWeight,
        total_paid: totalCost,
        deliveryLevel: deliveryLevel,
      });
      return await this.statisticsRepository.save(newStatistic);
    }
  }

  async generateStatisticsThreeMonthForUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    const currentDate = new Date();
    const threeMonth = new Date(user.createdAt);
    threeMonth.setMonth(threeMonth.getMonth() + 3);
    const nextThreeMonth = new Date(threeMonth);
    nextThreeMonth.setMonth(nextThreeMonth.getMonth() + 3);
    currentDate.getTime() > threeMonth.getTime()
      ? (user.createdAt = threeMonth)
      : (user.createdAt = user.createdAt);
    const startDate = user.createdAt;

    const endDate =
      currentDate.getTime() > threeMonth.getTime() ? nextThreeMonth : threeMonth;
    await this.userRepository.save(user);

    const products = await this.getProductsForUser(user, startDate, endDate);

    let totalWeight = 0;
    products.forEach((product) => {
      const weight = parseFloat(product.weight);
      if (!isNaN(weight)) {
        totalWeight += weight;
      }
    });
    const roundedTotalWeight = parseFloat(totalWeight.toFixed(2));

    const deliveryLevel = this.calculateDeliveryLevel(roundedTotalWeight);
    const totalCost = parseFloat(this.calculateTotalCost(products).toFixed(2));

    return { deliveryLevel, totalWeight: roundedTotalWeight, totalCost };
  }

  async getProductsForUser(user: User, startDate: Date, endDate: Date) {
    return await this.productRepository
      .createQueryBuilder('excel_data')
      .innerJoin('excel_data.user', 'one_users')
      .where('one_users.id = :userId', { userId: user.id })
      .andWhere('excel_data.dateCreated >= :startDate', { startDate })
      .andWhere('excel_data.dateCreated <= :endDate', { endDate })
      .getMany();
  }

  private calculateTotalWeight(products: Product[]): number {
    return products.reduce(
      (acc, product) => acc + parseFloat(product.weight),
      0,
    );
  }

  private calculateTotalCost(products: Product[]): number {
    return products.reduce((acc, product) => acc + product.deliveryCost, 0);
  }

  private calculateDeliveryLevel(totalWeight: number): DeliveryLevel {
    if (totalWeight >= 1000) {
      return DeliveryLevel.Platinum;
    } else if (totalWeight >= 500) {
      return DeliveryLevel.Gold;
    } else {
      return DeliveryLevel.Standard;
    }
  }
}
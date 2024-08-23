/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configOptions } from './config/service.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config/typeorm.config'; // Импорт экземпляра DataSource
import { AuthModule } from './auth/auth.module';
import { ConfirmationModule } from './confirmation/confirmation.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserRoleModule } from './userRole/userRole.module';
import { ProductModule } from './product/product.module';
import { StorageModule } from './storage/storage.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfirmationModule,
    UserRoleModule,
    ProductModule,
    StorageModule,
    ConfigModule.forRoot(configOptions),
    // Использование DataSource напрямую
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        // Инициализируем DataSource перед возвратом конфигурации
        await AppDataSource.initialize();
        return AppDataSource.options;
      }
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: configService.get<string>('EMAIL_TRANSPORT'),
        defaults: {
          from: configService.get<string>('EMAIL_FROM'),
        },
        template: {
          dir: __dirname + '/templates',
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    FileUploadModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

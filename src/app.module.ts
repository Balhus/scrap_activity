import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { EntryModule } from './entry/entry.module';
import { env } from 'process';
import { TrackingModule } from './tracking/tracking.module';
import { TrackingService } from './tracking/tracking.service';
import { IResponse } from './interfaces/IResponse';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: env.DB_HOST,
      port: parseInt(env.DB_PORT || '3306'),
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      autoLoadModels: true,
      synchronize: true,
    }),
    EntryModule,
    TrackingModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

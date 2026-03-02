import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import {
  User,
  Book,
  ReadingStatus,
  Review,
  Rating,
  Favorite,
} from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().default(3001),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([
      User,
      Book,
      ReadingStatus,
      Review,
      Rating,
      Favorite,
    ]),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}

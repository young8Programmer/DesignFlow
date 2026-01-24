import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Design } from '../designs/entities/design.entity';
import { Template } from '../templates/entities/template.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { Subscription } from '../subscription/entities/subscription.entity';
import { Asset } from '../assets/entities/asset.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'postgres'),
      database: this.configService.get('DB_DATABASE', 'designflow'),
      entities: [User, Design, Template, Payment, Wallet, Subscription, Asset],
      synchronize: true, // Auto-create tables in development
      logging: false, // Disable SQL query logging
      migrations: ['dist/migrations/*.js'],
      migrationsRun: false,
    };
  }
}

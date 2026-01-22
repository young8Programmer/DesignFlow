import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DesignsModule } from './designs/designs.module';
import { TemplatesModule } from './templates/templates.module';
import { PaymentsModule } from './payments/payments.module';
import { ExportsModule } from './exports/exports.module';
import { AssetsModule } from './assets/assets.module';
import { WalletModule } from './wallet/wallet.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TypeOrmConfigService } from './config/typeorm.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    DesignsModule,
    TemplatesModule,
    PaymentsModule,
    ExportsModule,
    AssetsModule,
    WalletModule,
    SubscriptionModule,
  ],
})
export class AppModule {}

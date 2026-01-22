import { Module } from '@nestjs/common';
import { ExportsService } from './exports.service';
import { ExportsController } from './exports.controller';
import { DesignsModule } from '../designs/designs.module';
import { PaymentsModule } from '../payments/payments.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [DesignsModule, PaymentsModule, SubscriptionModule],
  controllers: [ExportsController],
  providers: [ExportsService],
  exports: [ExportsService],
})
export class ExportsModule {}

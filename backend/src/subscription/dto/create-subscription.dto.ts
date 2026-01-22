import { IsEnum, IsNumber, IsString, IsDate } from 'class-validator';
import { SubscriptionPlan, SubscriptionStatus } from '../entities/subscription.entity';

export class CreateSubscriptionDto {
  @IsString()
  userId: string;

  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsNumber()
  amount: number;
}

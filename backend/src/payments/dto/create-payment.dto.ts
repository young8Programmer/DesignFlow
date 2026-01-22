import { IsEnum, IsNumber, IsString, IsOptional, IsObject } from 'class-validator';
import { PaymentType, PaymentStatus, PaymentProvider } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsString()
  userId: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentType)
  type: PaymentType;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsObject()
  metadata?: any;
}

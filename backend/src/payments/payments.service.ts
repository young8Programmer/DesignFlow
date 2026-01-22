import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentType, PaymentProvider } from './entities/payment.entity';
import { WalletService } from '../wallet/wallet.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private walletService: WalletService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(createPaymentDto);
    return this.paymentsRepository.save(payment);
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async processPayment(paymentId: string, status: PaymentStatus): Promise<Payment> {
    const payment = await this.findOne(paymentId);

    payment.status = status;

    if (status === PaymentStatus.COMPLETED) {
      if (payment.type === PaymentType.WALLET_TOPUP) {
        await this.walletService.addBalance(payment.userId, Number(payment.amount));
      }
    }

    return this.paymentsRepository.save(payment);
  }

  async createWalletTopup(userId: string, amount: number, provider: PaymentProvider): Promise<Payment> {
    return this.create({
      userId,
      amount,
      type: PaymentType.WALLET_TOPUP,
      provider,
      status: PaymentStatus.PENDING,
    });
  }

  async createExportPayment(userId: string, amount: number): Promise<Payment> {
    // Check if user has enough balance
    const balance = await this.walletService.getBalance(userId);
    
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Deduct from wallet
    await this.walletService.deductBalance(userId, amount);

    return this.create({
      userId,
      amount,
      type: PaymentType.EXPORT_DOWNLOAD,
      provider: PaymentProvider.WALLET,
      status: PaymentStatus.COMPLETED,
    });
  }
}

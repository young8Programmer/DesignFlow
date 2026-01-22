import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentProvider } from './entities/payment.entity';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('topup')
  async topupWallet(
    @Request() req,
    @Body() body: { amount: number; provider: PaymentProvider },
  ) {
    return this.paymentsService.createWalletTopup(
      req.user.id,
      body.amount,
      body.provider,
    );
  }

  @Post('export')
  async payForExport(
    @Request() req,
    @Body() body: { amount: number },
  ) {
    return this.paymentsService.createExportPayment(req.user.id, body.amount);
  }

  @Get(':id')
  async getPayment(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }
}

import { Controller, Get, Post, UseGuards, Request, Delete } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('status')
  async getStatus(@Request() req) {
    const hasActive = await this.subscriptionService.hasActiveSubscription(req.user.id);
    const subscription = await this.subscriptionService.getActiveSubscription(req.user.id);
    
    return {
      hasActiveSubscription: hasActive,
      subscription: subscription || null,
    };
  }

  @Delete()
  async cancel(@Request() req) {
    await this.subscriptionService.cancel(req.user.id);
    return { message: 'Subscription cancelled' };
  }
}

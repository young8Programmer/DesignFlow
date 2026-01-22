import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const subscription = this.subscriptionRepository.create(createSubscriptionDto);
    return this.subscriptionRepository.save(subscription);
  }

  async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        endDate: MoreThan(new Date()),
      },
    });

    return !!subscription;
  }

  async getActiveSubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        endDate: MoreThan(new Date()),
      },
    });
  }

  async cancel(userId: string): Promise<void> {
    const subscription = await this.getActiveSubscription(userId);
    if (subscription) {
      subscription.status = SubscriptionStatus.CANCELLED;
      await this.subscriptionRepository.save(subscription);
    }
  }
}

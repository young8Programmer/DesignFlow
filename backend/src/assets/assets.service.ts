import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset, AssetType } from './entities/asset.entity';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
    private subscriptionService: SubscriptionService,
  ) {}

  async findAll(type?: AssetType, userId?: string): Promise<Asset[]> {
    const where: any = {};
    if (type) {
      where.type = type;
    }

    const assets = await this.assetsRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    // Filter premium assets based on subscription
    if (userId) {
      const hasActiveSubscription = await this.subscriptionService.hasActiveSubscription(userId);
      return assets.map(asset => ({
        ...asset,
        isAccessible: !asset.isPremium || hasActiveSubscription,
      }));
    }

    return assets.map(asset => ({
      ...asset,
      isAccessible: !asset.isPremium,
    }));
  }

  async create(asset: Partial<Asset>): Promise<Asset> {
    const newAsset = this.assetsRepository.create(asset);
    return this.assetsRepository.save(newAsset);
  }
}

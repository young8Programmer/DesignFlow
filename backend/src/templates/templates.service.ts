import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template, TemplateCategory } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templatesRepository: Repository<Template>,
    private subscriptionService: SubscriptionService,
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const template = this.templatesRepository.create(createTemplateDto);
    return this.templatesRepository.save(template);
  }

  async findAll(category?: TemplateCategory, userId?: string): Promise<Template[]> {
    const where: any = {};
    if (category) {
      where.category = category;
    }

    const templates = await this.templatesRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    // Filter premium templates based on subscription
    if (userId) {
      const hasActiveSubscription = await this.subscriptionService.hasActiveSubscription(userId);
      return templates.map(template => ({
        ...template,
        isAccessible: !template.isPremium || hasActiveSubscription,
      }));
    }

    return templates.map(template => ({
      ...template,
      isAccessible: !template.isPremium,
    }));
  }

  async findOne(id: string, userId?: string): Promise<Template> {
    const template = await this.templatesRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    if (template.isPremium && userId) {
      const hasActiveSubscription = await this.subscriptionService.hasActiveSubscription(userId);
      if (!hasActiveSubscription) {
        throw new ForbiddenException('Premium template requires active subscription');
      }
    } else if (template.isPremium && !userId) {
      throw new ForbiddenException('Premium template requires authentication');
    }

    return template;
  }

  async remove(id: string): Promise<void> {
    const template = await this.templatesRepository.findOne({ where: { id } });
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    await this.templatesRepository.remove(template);
  }
}

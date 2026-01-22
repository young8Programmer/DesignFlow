import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Design } from './entities/design.entity';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';

@Injectable()
export class DesignsService {
  constructor(
    @InjectRepository(Design)
    private designsRepository: Repository<Design>,
  ) {}

  async create(userId: string, createDesignDto: CreateDesignDto): Promise<Design> {
    const design = this.designsRepository.create({
      ...createDesignDto,
      userId,
    });
    return this.designsRepository.save(design);
  }

  async findAll(userId: string): Promise<Design[]> {
    return this.designsRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Design> {
    const design = await this.designsRepository.findOne({
      where: { id },
      relations: ['user', 'template'],
    });

    if (!design) {
      throw new NotFoundException('Design not found');
    }

    if (design.userId !== userId && !design.isPublic) {
      throw new ForbiddenException('Access denied');
    }

    return design;
  }

  async update(id: string, userId: string, updateDesignDto: UpdateDesignDto): Promise<Design> {
    const design = await this.findOne(id, userId);
    
    if (design.userId !== userId) {
      throw new ForbiddenException('You can only update your own designs');
    }

    Object.assign(design, updateDesignDto);
    return this.designsRepository.save(design);
  }

  async remove(id: string, userId: string): Promise<void> {
    const design = await this.findOne(id, userId);
    
    if (design.userId !== userId) {
      throw new ForbiddenException('You can only delete your own designs');
    }

    await this.designsRepository.remove(design);
  }

  async duplicate(id: string, userId: string): Promise<Design> {
    const original = await this.findOne(id, userId);
    
    const duplicate = this.designsRepository.create({
      name: `${original.name} (Copy)`,
      description: original.description,
      canvasData: original.canvasData,
      width: original.width,
      height: original.height,
      userId,
      templateId: original.templateId,
    });

    return this.designsRepository.save(duplicate);
  }
}

import { Controller, Get, Query, Post, Body, UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetType } from './entities/asset.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll(
    @Query('type') type?: AssetType,
    @Request() req?: any,
  ) {
    return this.assetsService.findAll(type, req?.user?.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() asset: Partial<Asset>) {
    return this.assetsService.create(asset);
  }
}

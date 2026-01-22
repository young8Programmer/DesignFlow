import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplateCategory } from './entities/template.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.create(createTemplateDto);
  }

  @Get()
  findAll(
    @Query('category') category?: TemplateCategory,
    @Request() req?: any,
  ) {
    return this.templatesService.findAll(category, req?.user?.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req?: any) {
    return this.templatesService.findOne(id, req?.user?.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.templatesService.remove(id);
  }
}

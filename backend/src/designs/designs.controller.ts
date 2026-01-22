import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DesignsService } from './designs.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('designs')
@UseGuards(JwtAuthGuard)
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  @Post()
  create(@Request() req, @Body() createDesignDto: CreateDesignDto) {
    return this.designsService.create(req.user.id, createDesignDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.designsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.designsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDesignDto: UpdateDesignDto,
  ) {
    return this.designsService.update(id, req.user.id, updateDesignDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.designsService.remove(id, req.user.id);
  }

  @Post(':id/duplicate')
  duplicate(@Request() req, @Param('id') id: string) {
    return this.designsService.duplicate(id, req.user.id);
  }
}

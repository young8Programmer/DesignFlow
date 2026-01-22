import { Controller, Get, Param, Query, UseGuards, Request, Res } from '@nestjs/common';
import { ExportsService } from './exports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('exports')
@UseGuards(JwtAuthGuard)
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Get('pdf/:designId')
  async exportPDF(
    @Request() req,
    @Param('designId') designId: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.exportsService.exportToPDF(designId, req.user.id);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="design-${designId}.pdf"`);
    res.send(pdfBuffer);
  }

  @Get('png/:designId')
  async exportPNG(
    @Request() req,
    @Param('designId') designId: string,
    @Query('quality') quality: string,
    @Res() res: Response,
  ) {
    const qualityNum = quality ? parseFloat(quality) : 1;
    const pngBuffer = await this.exportsService.exportToPNG(designId, req.user.id, qualityNum);
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="design-${designId}.png"`);
    res.send(pngBuffer);
  }
}

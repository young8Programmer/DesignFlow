import { Injectable, ForbiddenException } from '@nestjs/common';
import { DesignsService } from '../designs/designs.service';
import { PaymentsService } from '../payments/payments.service';
import { SubscriptionService } from '../subscription/subscription.service';
import * as puppeteer from 'puppeteer';
import { createCanvas, loadImage } from 'canvas';

@Injectable()
export class ExportsService {
  constructor(
    private designsService: DesignsService,
    private paymentsService: PaymentsService,
    private subscriptionService: SubscriptionService,
  ) {}

  async exportToPDF(designId: string, userId: string): Promise<Buffer> {
    const design = await this.designsService.findOne(designId, userId);

    // Check if user has active subscription or charge for export
    const hasActiveSubscription = await this.subscriptionService.hasActiveSubscription(userId);
    const exportPrice = 500; // 500 UZS or equivalent

    if (!hasActiveSubscription) {
      // Charge for export
      await this.paymentsService.createExportPayment(userId, exportPrice);
    }

    // Convert canvas JSON to HTML
    const html = this.canvasToHTML(design.canvasData, design.width, design.height);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: design.width, height: design.height });

    const pdf = await page.pdf({
      width: `${design.width}px`,
      height: `${design.height}px`,
      printBackground: true,
    });

    await browser.close();

    return Buffer.from(pdf);
  }

  async exportToPNG(designId: string, userId: string, quality: number = 1): Promise<Buffer> {
    const design = await this.designsService.findOne(designId, userId);

    // Check if user has active subscription or charge for export
    const hasActiveSubscription = await this.subscriptionService.hasActiveSubscription(userId);
    const exportPrice = 500; // 500 UZS or equivalent

    if (!hasActiveSubscription) {
      // Charge for export
      await this.paymentsService.createExportPayment(userId, exportPrice);
    }

    // Create canvas and render design
    const canvas = createCanvas(design.width, design.height);
    const ctx = canvas.getContext('2d');

    // Render canvas data (simplified - in production, you'd need to fully render Fabric.js objects)
    await this.renderCanvasData(ctx, design.canvasData, design.width, design.height);

    return canvas.toBuffer('image/png');
  }

  private canvasToHTML(canvasData: any, width: number, height: number): string {
    // Convert Fabric.js JSON to HTML/CSS
    // This is a simplified version - in production, you'd need full Fabric.js rendering
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              width: ${width}px;
              height: ${height}px;
            }
            .canvas-container {
              width: ${width}px;
              height: ${height}px;
              position: relative;
            }
          </style>
        </head>
        <body>
          <div class="canvas-container">
            ${this.renderObjectsToHTML(canvasData.objects || [])}
          </div>
        </body>
      </html>
    `;
  }

  private renderObjectsToHTML(objects: any[]): string {
    return objects.map(obj => {
      if (obj.type === 'textbox' || obj.type === 'text') {
        return `<div style="position: absolute; left: ${obj.left}px; top: ${obj.top}px; font-size: ${obj.fontSize}px; color: ${obj.fill}; font-family: ${obj.fontFamily};">${obj.text}</div>`;
      }
      if (obj.type === 'rect') {
        return `<div style="position: absolute; left: ${obj.left}px; top: ${obj.top}px; width: ${obj.width}px; height: ${obj.height}px; background: ${obj.fill};"></div>`;
      }
      return '';
    }).join('');
  }

  private async renderCanvasData(ctx: any, canvasData: any, width: number, height: number): Promise<void> {
    // Set background
    if (canvasData.backgroundColor) {
      ctx.fillStyle = canvasData.backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    // Render objects
    const objects = canvasData.objects || [];
    for (const obj of objects) {
      await this.renderObject(ctx, obj);
    }
  }

  private async renderObject(ctx: any, obj: any): Promise<void> {
    ctx.save();

    if (obj.type === 'textbox' || obj.type === 'text') {
      ctx.font = `${obj.fontSize}px ${obj.fontFamily}`;
      ctx.fillStyle = obj.fill || '#000000';
      ctx.textAlign = obj.textAlign || 'left';
      ctx.fillText(obj.text, obj.left, obj.top + obj.fontSize);
    } else if (obj.type === 'rect') {
      ctx.fillStyle = obj.fill || '#000000';
      ctx.fillRect(obj.left, obj.top, obj.width, obj.height);
    } else if (obj.type === 'image' && obj.src) {
      try {
        const img = await loadImage(obj.src);
        ctx.drawImage(img, obj.left, obj.top, obj.width, obj.height);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    }

    ctx.restore();
  }
}

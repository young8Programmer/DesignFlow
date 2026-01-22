import { IsString, IsOptional, IsObject, IsInt, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { TemplateCategory } from '../entities/template.entity';

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  canvasData: any;

  @IsInt()
  width: number;

  @IsInt()
  height: number;

  @IsEnum(TemplateCategory)
  category: TemplateCategory;

  @IsBoolean()
  isPremium: boolean;

  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

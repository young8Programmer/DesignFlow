import { IsString, IsOptional, IsObject, IsInt, IsBoolean, Min } from 'class-validator';

export class CreateDesignDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  canvasData: any;

  @IsInt()
  @Min(100)
  width: number;

  @IsInt()
  @Min(100)
  height: number;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  templateId?: string;
}

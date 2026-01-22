import { IsString, IsOptional, IsObject, IsInt, IsBoolean, Min } from 'class-validator';

export class UpdateDesignDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  canvasData?: any;

  @IsOptional()
  @IsInt()
  @Min(100)
  width?: number;

  @IsOptional()
  @IsInt()
  @Min(100)
  height?: number;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  thumbnail?: string;
}

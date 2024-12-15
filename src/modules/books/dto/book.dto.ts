import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty } from '@nestjs/class-validator';
import { IsInt, IsOptional } from 'class-validator';
import { BaseDTO } from 'src/DTO/BaseDTO';

export class CreateBookDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  publishedDate: Date;

  @IsArray()
  @ArrayNotEmpty()
  categoryIds: number[];
}

export class GetAllBooksDTO extends BaseDTO {
  search?: string;
  isApproved?: boolean;
  year?: number;
  categoryId?: number;
}

export class UpdateBookDTO {
  @IsOptional()
  title?: string;

  @IsOptional()
  publishedDate?: Date;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];
}

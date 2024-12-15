import { IsNotEmpty, IsOptional } from "@nestjs/class-validator";
import { BaseDTO } from "src/DTO/BaseDTO";

export class CreateCategoryDTO {
    @IsNotEmpty()
    categoryName: string;

    @IsOptional()
    description: string;
}

export class UpdateCategoryDTO {
    @IsOptional()
    categoryName: string;

    @IsOptional()
    description: string;
}

export class GetAllCategoriesDTO extends BaseDTO{
    search?: string;
}
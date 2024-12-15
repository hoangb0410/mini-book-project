import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDTO,
  GetAllCategoriesDTO,
  UpdateCategoryDTO,
} from './dto/category.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() payload: CreateCategoryDTO) {
    return this.categoriesService.createCategory(payload);
  }

  @UseGuards(RolesGuard)
  @Get()
  async getAllCategories(@Query() payload: GetAllCategoriesDTO) {
    const categories = await this.categoriesService.getAllCategories(payload);
    return categories;
  }

  @Get(':id')
  async getCategoryDetails(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getCategoryDetails(id);
  }

  @Put(':id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCategoryDTO,
  ) {
    return this.categoriesService.updateCategory(id, payload);
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return await this.categoriesService.deleteCategory(id);
  }
}

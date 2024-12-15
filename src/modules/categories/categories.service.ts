import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import {
  CreateCategoryDTO,
  GetAllCategoriesDTO,
  UpdateCategoryDTO,
} from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async createCategory(payload: CreateCategoryDTO): Promise<Category> {
    const { categoryName, description } = payload;
    const existingCategory = await this.categoriesRepository.findOne({
      where: [{ categoryName: categoryName }],
    });
    if (existingCategory) {
      throw new BadRequestException('category already exists');
    }
    const newCategory = this.categoriesRepository.create({
      categoryName,
      description: description || '',
    });

    await this.categoriesRepository.save(newCategory);
    return newCategory;
  }

  async getAllCategories(payload: GetAllCategoriesDTO): Promise<Category[]> {
    const {page, limit, search} = payload;
    const query = this.categoriesRepository.createQueryBuilder('category');
    // search by category name
    if (search) {
      query.andWhere('category.categoryName ILIKE :search', {
        search: `%${search}%`,
      });
    }
    // pagination
    if (page && limit) {
      const offset = (page - 1) * limit;
      query.limit(limit).offset(offset);
    }
    return await query.getMany();
  }

  async getCategoryDetails(categoryId: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ categoryId });
    if (!category) {
      throw new NotFoundException('category not found');
    }
    return category;
  }

  async updateCategory(
    categoryId: number,
    payload: UpdateCategoryDTO,
  ): Promise<Category> {
    const category = await this.getCategoryDetails(categoryId);
    const { categoryName, description } = payload;
    if (categoryName) {
      category.categoryName = categoryName;
    }
    if (description) {
      category.description = description;
    }
    await this.categoriesRepository.save(category);
    return category;
  }

  async deleteCategory(categoryId: number): Promise<string> {
    const category = await this.categoriesRepository.delete(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return 'Delete successfully';
  }
}

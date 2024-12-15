import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto, GetAllBooksDTO, UpdateBookDTO } from './dto/book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async createBook(payload: CreateBookDto, userId: number): Promise<Book> {
    const { title, publishedDate, categoryIds } = payload;
    const existingBook = await this.booksRepository.findOne({
      where: [{ title: title }],
    });
    if (existingBook) {
      throw new BadRequestException('book already exists');
    }

    // Fetch the User entity from the database
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new BadRequestException('user not found');
    }

    const categories = await this.categoriesRepository.findByIds(categoryIds);

    const newBook = this.booksRepository.create({
      title,
      publishedDate,
      isApproved: false,
      user: user,
      categories,
    });
    await this.booksRepository.save(newBook);
    return newBook;
  }

  async getAllBooks(payload: GetAllBooksDTO): Promise<Book[]> {
    const { page, limit, search, isApproved, year, categoryId } = payload;
    const query = this.booksRepository.createQueryBuilder('book');
    // search
    if (search) {
      query.andWhere('book.title ILIKE :search', { search: `%${search}%` });
    }
    // filter
    if (isApproved !== undefined) {
      query.andWhere('book.isApproved = :isApproved', { isApproved });
    }
    if (year) {
      query.andWhere('EXTRACT(YEAR FROM book.publishedDate) = :year', { year });
    }
    if (categoryId) {
      query
        .innerJoin('book.categories', 'category')
        .andWhere('category.categoryId = :categoryId', { categoryId });
    }
    // pagination
    if (page && limit) {
      const offset = (page - 1) * limit;
      query.limit(limit).offset(offset);
    }
    return await query.getMany();
  }

  async getBookDetails(bookId: number): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ bookId });
    if (!book) {
      throw new NotFoundException('book not found');
    }
    return book;
  }

  async updateBook(bookId: number, payload: UpdateBookDTO): Promise<Book> {
    const book = await this.getBookDetails(bookId);
    const { title, publishedDate, categoryIds } = payload;
    if (title) {
      book.title = title;
    }
    if (publishedDate) {
      book.publishedDate = publishedDate;
    }

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoriesRepository.findByIds(categoryIds);
      book.categories = categories;
    }
    await this.booksRepository.save(book);
    return book;
  }

  async deleteBook(bookId: number): Promise<string> {
    const book = await this.booksRepository.findOne({
      where: { bookId },
      relations: ['categories'],
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    await this.booksRepository.remove(book);
    return 'delete successfully';
  }

  async aprroveBook(bookId: number): Promise<Book> {
    const book = await this.getBookDetails(bookId);
    book.isApproved = !book.isApproved;
    await this.booksRepository.save(book);
    return book;
  }
}

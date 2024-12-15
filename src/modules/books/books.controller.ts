import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto, GetAllBooksDTO, UpdateBookDTO } from './dto/book.dto';
import { CustomRequest } from 'src/middlewares/jwt.middleware';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createBook(@Body() payload: CreateBookDto, @Req() req: CustomRequest) {
    return await this.booksService.createBook(payload, req.user.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async getAllBooks(@Query() payload: GetAllBooksDTO) {
    return await this.booksService.getAllBooks(payload);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getBookDetails(@Param('id', ParseIntPipe) id: number) {
    return await this.booksService.getBookDetails(id);
  }

  @Put(':id')
  async updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookDTO,
  ) {
    return await this.booksService.updateBook(id, payload);
  }

  @Delete(':id')
  async deleteBook(@Param('id', ParseIntPipe) id: number){
    return  await this.booksService.deleteBook(id);
  }

  @Put('/approved/:id')
  async aprroveBook(@Param('id', ParseIntPipe) id:number){
    return await this.booksService.aprroveBook(id);
  }
}

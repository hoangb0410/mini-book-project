import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/entities/book.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtMiddleware } from 'src/middlewares/jwt.middleware';
import { User } from 'src/entities/user.entity';
import { Category } from 'src/entities/category.entity';
import { AdminMiddleware } from 'src/middlewares/admin.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_KEY || 'ahbcghsgcvtrsa',
      signOptions: { expiresIn: '15d' },
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [BooksController],
  providers: [JwtMiddleware, BooksService],
})
export class BooksModule {
  // add middleware
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(JwtMiddleware)
  //     .forRoutes({ path: 'books', method: RequestMethod.ALL });
  //   consumer
  //     .apply(AdminMiddleware)
  //     .forRoutes({ path: 'books/approved/:id', method: RequestMethod.PUT }); // fix for me
  // }
}

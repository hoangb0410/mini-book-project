import { Module } from '@nestjs/common';
import { connectDB } from './config/connectDB';
import { CategoriesModule } from './modules/categories/categories.module';
import { UsersModule } from './modules/users/users.module';
import { BooksModule } from './modules/books/books.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtMiddleware } from './middlewares/jwt.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_KEY || 'ahbcghsgcvtrsa',
      signOptions: { expiresIn: '15d' },
    }),
    connectDB,
    UsersModule,
    BooksModule,
    CategoriesModule,
    AuthModule,
  ],
  providers: [JwtMiddleware],
})
export class AppModule {}

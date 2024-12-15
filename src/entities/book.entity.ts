import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn()
  bookId: number;

  @Column()
  title: string;

  @Column()
  publishedDate: Date;

  @Column()
  isApproved: boolean;

  @ManyToOne((type) => User, (user) => user.books)
  @JoinColumn({ name: 'userId' }) // set name to be userId
  user: User;

  @ManyToMany(() => Category, (category) => category.books, { cascade: true, onDelete: 'CASCADE' })
  @JoinTable()
  categories: Category[];
}

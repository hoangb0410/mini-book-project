import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.entity";

@Entity({name: 'categories'})
export class Category {
    @PrimaryGeneratedColumn()
    categoryId: number;

    @Column({ unique: true })
    categoryName: string;

    @Column({nullable: true})
    description: string;

    @ManyToMany(() => Book, (book) => book.categories)
    books: Book[]
}
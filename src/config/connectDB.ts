import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports:[
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password:'root',
            database: 'book-management',
            entities:[__dirname + '/../**/*.entity.{js,ts}'],
            synchronize: true
        }),
    ]
})

export class connectDB{}
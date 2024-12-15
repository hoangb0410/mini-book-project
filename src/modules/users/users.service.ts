import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { GetAllUsersDTO, UpdateUserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllUsers(payload: GetAllUsersDTO): Promise<User[]> {
    const { page, limit, search, isAdmin, isActive } = payload;
    const query = this.usersRepository.createQueryBuilder('user');
    // search by firstname, lastname, fullname = firstname + ' ' + lastname
    if (search) {
      query.andWhere(
        'user.firstname ILIKE :search OR user.lastname ILIKE :search OR CONCAT(user.firstname, \' \', user.lastname) ILIKE :search',
        { search: `%${search}%` },
      );
    }
    // filter by isAdmin
    if (isAdmin !== undefined) {
      query.andWhere('user.isAdmin = :isAdmin', { isAdmin });
    }
    // filter by isActive
    if (isActive !== undefined){
      query.andWhere('user.isActive= :isActive', { isActive });
    }

    if (page && limit) {
      const offset = (page - 1) * limit;
      query.limit(limit).offset(offset);
    }
    return await query.getMany();
  }

  async getUserDetails(userId: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDTO,
  ): Promise<User> {
    const user = await this.getUserDetails(userId);
    const { username, firstname, lastname, email, password } = updateUserDto;

    if (username) {
      user.username = username;
    }

    if (firstname) {
      user.firstname = firstname;
    }

    if (lastname) {
      user.firstname = lastname;
    }

    if (email) {
      user.email = email;
    }
    if (password) {
      const hashed = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashed;
    }
    await this.usersRepository.save(user);
    return user;
  }

  async deleteUser(userId: number): Promise<string> {
    const user = await this.usersRepository.delete(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return 'delete successfully';
  }
}

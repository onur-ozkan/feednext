import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../Entity/users.entity';
import { UserInterface } from '../Interface/user.interface';
import { Serializer } from 'jsonapi-serializer';
import { CreateUserDto } from '../Dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async get(id: number) {
    return this.userRepository.findOne(id);
  }

  async findOne(usernameParam: string): Promise<UserEntity> {
    try {
      const result = await this.userRepository.findOneOrFail({ username: usernameParam });

      return await new Serializer('users', { attributes: ['fullName', 'username', 'email', 'createdAt'] }).serialize(result);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  // User registration process logic
  async create(dto: CreateUserDto): Promise<UserInterface> {
    // Create new user
    const newUser = new UserEntity({
      email: dto.email,
      username: dto.username,
      password: dto.password,
      fullName: dto.fullName,
    });

    try {
      const result = await this.userRepository.save(newUser);
      return await new Serializer('user-identities', { attributes: ['fullName', 'username', 'email', 'accessToken'] }).serialize(result);
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../Entity/users.entity';
import { UserInterface } from '../Interface/user.interface';
import { Serializer } from 'jsonapi-serializer';
import { Validator } from 'class-validator';
import { CreateUserDto } from '../Dto/create-user.dto';
import * as crypto from 'crypto';

const validator = new Validator();
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

  // User validation process logic
  async userValidation(incEmail?: string, incUsername?: string, incPassword?: string): Promise<UserEntity> {

    const passHash = crypto.createHmac('sha256', incPassword).digest('hex');
    if (validator.isEmail(incEmail)) {
      return await this.userRepository.findOneOrFail({email: incEmail, password: passHash});
    }

    return await this.userRepository.findOneOrFail({username: incUsername, password: passHash});
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

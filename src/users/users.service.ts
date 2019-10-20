import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRO } from './interface/user.interface';
import { validate } from 'class-validator';
import { configService } from '../shared/config/config.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(usernameParam: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOneOrFail({ username: usernameParam });
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = {User: ' not found'};
      throw new HttpException({ errors }, 401);
    }

    return user;
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    const { fullName, username, password, email } = dto;

    // Create new user
    const newUser = new UserEntity();
    newUser.fullName = fullName;
    newUser.username = username;
    newUser.password = password;
    newUser.email = email;

    // Catch validation errors
    const errors = await validate(newUser);
    if (errors.length > 0) {
      throw new HttpException({ message: 'Input data validation failed.', errors }, HttpStatus.BAD_REQUEST);
    } else {
      // Save to the database
      try {
        const savedUser = await this.userRepository.save(newUser);
        return this.buildUserRO(savedUser);
      } catch (err) {
        throw new HttpException(err, HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
  }

  public generateJWT(user) {
    const jwt = require('jsonwebtoken');
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      password: user.password,
      email: user.email,
      exp: exp.getTime() / 1000,
    }, configService.getSecretKey());
  }

  private buildUserRO(user: UserEntity) {
    // tslint:disable-next-line:no-shadowed-variable
    const UserRO = {
      fullName: user.fullName,
      username: user.username,
      password: user.password,
      email: user.email,
      accessToken: this.generateJWT(user),
    };

    return { user: UserRO };
  }
}

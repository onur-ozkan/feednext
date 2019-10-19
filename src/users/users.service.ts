import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRO } from './interface/user.interface';
import { validate } from 'class-validator';
import { configService } from '../config/config.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(idParam): Promise<UserEntity> {
    return await this.userRepository.findOne({ id: idParam });
  }

  async create(dto: CreateUserDto): Promise<UserRO> {

    // check uniqueness of username/email
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
      } catch (MongoWriteException) {
        throw new HttpException(
          { message: 'Incoming data is already exists in the database.', MongoWriteException },
          HttpStatus.UNPROCESSABLE_ENTITY);
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
      token: this.generateJWT(user),
    };

    return {user: UserRO};
  }
}

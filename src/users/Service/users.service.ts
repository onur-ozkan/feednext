import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../Entity/users.entity';
import { CreateUserDto } from '../Dto/create-user.dto';
import { UserRO } from '../Interface/user.interface';
import { configService } from '../../shared/config/config.service';
import { Serializer } from 'jsonapi-serializer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(usernameParam: string): Promise<UserEntity> {
    try {
      const result = await this.userRepository.findOneOrFail({ username: usernameParam });

      return await new Serializer('users', { attributes: ['fullName', 'username', 'email', 'createdAt'] }).serialize(result);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    // Create new user
    const newUser = new UserEntity({
      email: dto.email,
      username: dto.username,
      password: dto.password,
      fullName: dto.fullName,
    });

    try {
      const savedUser = await this.userRepository.save(newUser);
      const result = this.buildUserRO(savedUser);

      return await new Serializer('user-identities', { attributes: ['fullName', 'username', 'email', 'accessToken'] }).serialize(result.user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.UNPROCESSABLE_ENTITY);
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

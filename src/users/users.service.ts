import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { UserEntity } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRO } from './interface/user.interface';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(idParam): Promise<UserEntity> {
    return await this.userRepository.findOne({id: idParam});
  }

  async create(dto: CreateUserDto): Promise<UserRO> {

    // check uniqueness of username/email
    const { fullName, username, password, email } = dto;
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();

    if (user) {
      // tslint:disable-next-line:no-shadowed-variable
      const errors = {username: 'Username and email must be unique.'};
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);

    }

    // create new user
    const newUser = new UserEntity();
    newUser.fullName = fullName;
    newUser.username = username;
    newUser.password = password;
    newUser.email = email;

    const errors = await validate(newUser);
    if (errors.length > 0) {
      // tslint:disable-next-line:variable-name
      const _errors = {username: 'Userinput is not valid.'};
      throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);

    } else {
      const savedUser = await this.userRepository.save(newUser);
      return this.buildUserRO(savedUser);
    }

  }

  private buildUserRO(user: UserEntity) {
    // tslint:disable-next-line:no-shadowed-variable
    const UserRO = {
      fullName: user.fullName,
      username: user.username,
      password: user.password,
      email: user.email,
    };

    return {user: UserRO};
  }
}

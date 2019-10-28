import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../Entity/users.entity';
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
}

import { Get, Post, Body, Param, Controller, UsePipes  } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';
import { ValidationPipe } from '../shared/pipes/validation.pipe';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() userData: CreateUserDto) {
    return this.usersService.create(userData);
  }
}

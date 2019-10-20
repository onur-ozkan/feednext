import { Get, Param, Controller, UseGuards, UseInterceptors, ClassSerializerInterceptor  } from '@nestjs/common';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':username')
  findOne(@Param('username') username): Promise<UserEntity> {
    return this.usersService.findOne(username);
  }
}

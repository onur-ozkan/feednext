import { Get, Param, Controller, UseGuards } from '@nestjs/common';
import { UserEntity } from '../Entity/users.entity';
import { UsersService } from '../Service/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':username')
  findOne(@Param('username') username): Promise<UserEntity> {
    return this.usersService.findOne(username);
  }
}

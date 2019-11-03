import { Get, Param, Controller, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserEntity } from '../../../shared/Entities/users.entity'
import { UsersService } from '../Service/users.service'

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get(':username')
    findOne(@Param('username') username): Promise<UserEntity> {
        return this.usersService.findOne(username)
    }
}

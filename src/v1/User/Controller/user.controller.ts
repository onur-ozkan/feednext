import { Get, Param, Controller, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersEntity } from '../../../shared/Entities/users.entity'
import { UserService } from '../Service/user.service'

@Controller()
export class UsersController {
    constructor(private readonly usersService: UserService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get(':username')
    findOne(@Param('username') username): Promise<UsersEntity> {
        return this.usersService.findOne(username)
    }
}

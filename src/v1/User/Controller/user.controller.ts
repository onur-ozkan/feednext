import { Get, Param, Controller } from '@nestjs/common'
import { ApiUseTags } from '@nestjs/swagger'
import { UsersEntity } from '../../../shared/Entities/users.entity'
import { UserService } from '../Service/user.service'

@ApiUseTags('v1/user')
@Controller()
export class UsersController {
    constructor(private readonly usersService: UserService) {}

    @Get(':username')
    getProfileByUsername(@Param('username') username): Promise<UsersEntity> {
        return this.usersService.getProfileByUsername(username)
    }
}

import { Get, Param, Controller, Body, Patch, UseGuards, Headers } from '@nestjs/common'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { UserService } from '../Service/user.service'
import { UpdateUserDto } from '../Dto/update-user.dto'
import { AuthGuard } from '@nestjs/passport'

@ApiUseTags('v1/user')
@Controller()
export class UsersController {
    constructor(private readonly usersService: UserService) {}

    @Get(':username')
    getProfileByUsername(@Param('username') username): Promise<UsersEntity> {
        return this.usersService.getProfileByUsername(username)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':username/update')
    updateProfile(
        @Param('username') username,
        @Body() dto: UpdateUserDto,
        @Headers('authorization') bearer: string,
    ) {
        // const authToken = bearer.substring(7)
        return this.usersService.updateProfileByUsername(username, dto)
    }
}

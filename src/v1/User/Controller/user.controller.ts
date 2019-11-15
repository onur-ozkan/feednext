import { Get, Param, Controller, Body, Patch, UseGuards, Headers, BadRequestException } from '@nestjs/common'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { AuthGuard } from '@nestjs/passport'
import { authUserService } from 'src/shared/Services/auth-user.service'
import { UserService } from '../Service/user.service'
import { UpdateUserDto } from '../Dto/update-user.dto'

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
    ): Promise<UsersEntity> {
        if (username !== authUserService.getUserData(bearer, 'username')) {
            throw new BadRequestException()
        }

        return this.usersService.updateProfileByUsername(username, dto)
    }
}

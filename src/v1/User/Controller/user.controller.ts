import { Get, Param, Controller, Body, Patch, Put, UseGuards, Headers, BadRequestException, HttpException } from '@nestjs/common'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { AuthGuard } from '@nestjs/passport'
import { currentUserService } from 'src/shared/Services/current-user.service'
import { UserService } from '../Service/user.service'
import { UpdateUserDto } from '../Dto/update-user.dto'

@ApiUseTags('v1/user')
@Controller()
export class UsersController {
    constructor(private readonly usersService: UserService) {}

    @Get(':username')
    getUser(@Param('username') username): Promise<UsersEntity> {
        return this.usersService.getUser(username)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':username')
    updateUser(
        @Param('username') username: string,
        @Body() dto: UpdateUserDto,
        @Headers('authorization') bearer: string,
    ): Promise<UsersEntity> {
        if (username !== currentUserService.getCurrentUser(bearer, 'username')) {
            throw new BadRequestException()
        }

        return this.usersService.updateUser(username, dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Put(':username/disable-account')
    disableUser(
        @Param('username') username: string,
        @Headers('authorization') bearer: string,
    ): Promise<HttpException> {
        if (username !== currentUserService.getCurrentUser(bearer, 'username')) {
            throw new BadRequestException()
        }

        return this.usersService.disableUser(username)
    }
}

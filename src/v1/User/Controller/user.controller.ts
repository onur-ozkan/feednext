import { Get, Param, Controller, Body, Patch, Put, UseGuards, Headers, BadRequestException, HttpException, Post, Query } from '@nestjs/common'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { AuthGuard } from '@nestjs/passport'
import { currentUserService } from 'src/shared/Services/current-user.service'
import { UserService } from '../Service/user.service'
import { UpdateUserDto } from '../Dto/update-user.dto'
import { ActivateUserDto } from '../Dto/activate-user.dto'

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
        if (username !== currentUserService.getCurrentUser(bearer, 'username')) throw new BadRequestException()

        return this.usersService.updateUser(username, dto)
    }

    @Get('verfiy-update-email')
    async verifyUpdateEmail(@Query('token') token: string): Promise<HttpException> {
        return this.usersService.verifyUpdateEmail(token)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Put(':username')
    disableUser(
        @Param('username') username: string,
        @Headers('authorization') bearer: string,
    ): Promise<HttpException> {
        if (username !== currentUserService.getCurrentUser(bearer, 'username')) {
            throw new BadRequestException()
        }

        return this.usersService.disableUser(username)
    }

    @Post('send-activation-mail')
    async sendActivationMail(@Body() dto: ActivateUserDto): Promise<HttpException> {
        return this.usersService.sendActivationMail(dto)
    }

    @Get('activate-user')
    async activateUser(@Query('token') token: string): Promise<HttpException> {
        return this.usersService.activateUser(token)
    }
}

// Nest dependencies
import {
    BadRequestException,
    HttpException,
    Controller,
    UseGuards,
    Get,
    Post,
    Patch,
    Put,
    Param,
    Body,
    Headers,
    Query,
    Res,
    Req,
    HttpStatus
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

// Local files
import { jwtManipulationService } from 'src/shared/Services/jwt.manipulation.service'
import { UserService } from '../Service/user.service'
import { UpdateUserDto } from '../Dto/update-user.dto'
import { ActivateUserDto } from '../Dto/activate-user.dto'
import { ISerializeResponse } from 'src/shared/Services/serializer.service'

@ApiTags('v1/user')
@Controller()
export class UsersController {
    constructor(private readonly usersService: UserService) {}

    @Get(':username')
    getUser(@Param('username') username): Promise<ISerializeResponse> {
        return this.usersService.getUser(username)
    }

    @Get(':username/votes')
    getVotes(
        @Param('username') username,
        @Query() query: { limit: number, skip: number },
        @Query('voteType') voteType: 'up' | 'down',
    ): Promise<ISerializeResponse> {
        return this.usersService.getVotes({username, query, voteType})
    }

    @Get(':username/pp')
    async getProfilePicture(@Param('username') username,  @Res() res: any): Promise<void> {
        const buffer = await this.usersService.getProfilePictureBuffer(username)
        res.type('image/jpeg').send(buffer)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Put('pp')
    uploadProfilePicture(@Headers('authorization') bearer: string, @Req() req): Promise<HttpException> {
        const username = jwtManipulationService.decodeJwtToken(bearer, 'username')

        return new Promise((resolve, reject) => {
            const handler = (_field, file, _filename, _encoding, mimetype) => {
                if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') reject(new BadRequestException('File must be image'))
                this.usersService.uploadProfilePicture(username, file)
            }

            req.multipart(handler, (error) => {
                if (error) reject(error)
                resolve(new HttpException('Upload successfully ended', HttpStatus.OK))
            })
        })
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':username')
    updateUser(
        @Param('username') username: string,
        @Body() dto: UpdateUserDto,
        @Headers('authorization') bearer: string,
    ): Promise<ISerializeResponse> {
        if (username !== jwtManipulationService.decodeJwtToken(bearer, 'username')) throw new BadRequestException()

        return this.usersService.updateUser(username, dto)
    }

    @Get('verfiy-update-email')
    async verifyUpdateEmail(@Query('token') token: string): Promise<HttpException> {
        return this.usersService.verifyUpdateEmail(token)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch('disable/:username')
    disableUser(
        @Param('username') username: string,
        @Headers('authorization') bearer: string,
    ): Promise<HttpException> {
        if (username !== jwtManipulationService.decodeJwtToken(bearer, 'username')) {
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

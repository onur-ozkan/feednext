// Nest dependencies
import {
    Controller,
    Headers,
    Post,
    Body,
    UseGuards,
    Get,
    Patch,
    HttpException,
    Query,
    Res,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

// Local files
import { AuthService } from '../Service/auth.service'
import { CreateAccountDto } from '../Dto/create-account.dto'
import { LoginDto } from '../Dto/login.dto'
import { AccountRecoveryDto } from '../Dto/account-recovery.dto'
import { jwtManipulationService } from 'src/shared/Services/jwt.manipulation.service'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'
import { configService } from 'src/shared/Services/config.service'

@ApiTags('v1/auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    signUp(@Body() dto: CreateAccountDto): Promise<ISerializeResponse> {
        return this.authService.signUp(dto)
    }

    @Post('signin')
    async signIn(@Body() dto: LoginDto, @Res() res: any): Promise<void> {
        const user = await this.authService.validateUser(dto)
        const authResponse: any = await this.authService.signIn(user, dto)
        const refreshToken = authResponse.attributes.user.refresh_token
        delete authResponse.attributes.user.refresh_token

        res.setCookie('rt', refreshToken, {
            domain: configService.getEnv('APP_DOMAIN'),
            path: '/auth/sign-in',
            httpOnly: true,
            secure: true
        }).send(authResponse)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('signout')
    async signOut(@Headers('authorization') bearer: string): Promise<ISerializeResponse> {
        return await this.authService.signOut(bearer)
    }

    @Patch('signin/account-recovery')
    accountRecovery(@Body() dto: AccountRecoveryDto): Promise<HttpException> {
        return this.authService.accountRecovery(dto)
    }

    @Get('account-verification')
    verifyAccount(@Query('token') token: string): Promise<HttpException> {
        return this.authService.accountVerification(token)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('check-token')
    async checkJwtToken(@Headers('authorization') bearer: string): Promise<ISerializeResponse> {
        const data = await jwtManipulationService.decodeJwtToken(bearer, 'all')
        serializerService.deleteProperties(data, ['iat', 'exp'])
        return serializerService.serializeResponse('user', data)
    }

    @Get('refresh-token')
    async refreshJwtToken(@Headers('refresh-token') refreshToken: string): Promise<ISerializeResponse> {
        return await this.authService.refreshToken(refreshToken)
    }
}

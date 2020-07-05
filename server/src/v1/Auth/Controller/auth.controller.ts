// Nest dependencies
import {
    Controller,
    Headers,
    Post,
    Body,
    UseGuards,
    Get,
    Patch,
    Query,
    Request,
    Res,
    BadRequestException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

// Other dependencies
import { RateLimit } from 'nestjs-fastify-rate-limiter'

// Local files
import { AuthService } from '../Service/auth.service'
import { CreateAccountDto } from '../Dto/create-account.dto'
import { LoginDto } from '../Dto/login.dto'
import { GenerateRecoveryKeyDto } from '../Dto/generate-recovery-key.dto'
import { RecoverAccountDto } from '../Dto/recover-account.dto'
import { ISerializeResponse } from 'src/shared/Services/serializer.service'
import { configService } from 'src/shared/Services/config.service'
import { StatusOk } from 'src/shared/Types'

@ApiTags('v1/auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @RateLimit({
        points: 5,
        duration: 300,
        errorMessage: 'You have reached the limit of login requests. You have to wait 5 minutes before trying again.'
    })
    @Post('signin')
    async signIn(@Body() dto: LoginDto, @Res() res: any): Promise<void> {
        const user = await this.authService.validateUser(dto)
        const authResponse: any = await this.authService.signIn(user, dto)
        const refreshToken = authResponse.attributes.user.refresh_token
        delete authResponse.attributes.user.refresh_token

        if (dto.rememberMe) {
            res.setCookie('rt', refreshToken, {
                domain: `${configService.getEnv('APP_DOMAIN').split('//')[1]}`,
                path: '/api/v1/auth/refresh-token',
                httpOnly: true,
                secure: true
            }).send(authResponse)
            return
        }

        res.send(authResponse)
    }

    @RateLimit({
        points: 5,
        duration: 120,
        errorMessage: 'You have reached the limit. You have to wait 2 minutes before trying again.'
    })
    @Post('signup')
    signUp(@Body() dto: CreateAccountDto): Promise<StatusOk> {
        return this.authService.signUp(dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('signout')
    async signOut(@Headers('authorization') bearer: string): Promise<StatusOk> {
        return this.authService.signOut(bearer)
    }

    @RateLimit({
        points: 3,
        duration: 300,
        errorMessage: 'You have reached the limit. You have to wait 5 minutes before trying again.'
    })
    @Patch('generate-recovery-key')
    generateRecoveryKey(@Body() dto: GenerateRecoveryKeyDto): Promise<StatusOk> {
        return this.authService.generateRecoveryKey(dto)
    }

    @RateLimit({
        points: 3,
        duration: 300,
        errorMessage: 'You have reached the limit. You have to wait 5 minutes before trying again.'
    })
    @Patch('recover-account')
    recoverAccount(@Body() dto: RecoverAccountDto): Promise<StatusOk> {
        return this.authService.recoverAccount(dto)
    }

    @RateLimit({
        points: 3,
        duration: 300,
        errorMessage: 'You have reached the limit. You have to wait 5 minutes before trying again.'
    })
    @Get('account-verification')
    accountVerification(@Query('token') token: string): Promise<StatusOk> {
        return this.authService.accountVerification(token)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('check-token')
    async checkJwtToken(): Promise<StatusOk> {
        return { status: 'ok', message: 'Token is valid' }
    }

    @Get('refresh-token')
    async refreshJwtToken(@Request() { cookies }): Promise<ISerializeResponse> {
        if (!cookies.rt) throw new BadRequestException('Server could not give access tokken without refresh token')
        return await this.authService.refreshToken(cookies.rt)
    }
}

// Nest dependencies
import {
    Controller,
    UseGuards,
    Headers,
    Post,
    Body,
    Get,
    Param,
    Query,
    Delete,
    Patch,
    Put,
    Req,
    BadRequestException,
    Res
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport/dist/auth.guard'

// Other dependencies
import * as concat from 'concat-stream'
import { RateLimit } from 'nestjs-rate-limiter'

// Local dependencies
import { jwtManipulationService } from 'src/shared/Services/jwt.manipulation.service'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { UpdateTitleDto } from '../Dto/update-title.dto'
import { ISerializeResponse } from 'src/shared/Services/serializer.service'
import { TitleService } from '../Service/title.service'
import { RateTitleDto } from '../Dto/rate-title.dto'
import { Role } from 'src/shared/Enums/Roles'
import { StatusOk } from 'src/shared/Types'

@ApiTags('v1/title')
@Controller()
export class TitleController {
    constructor(private readonly titleService: TitleService) {}

    @Get(':titleQueryData')
    getTitle(
        @Param('titleQueryData') titleQueryData: string,
        @Query('type') type: 'id' | 'slug'
    ): Promise<ISerializeResponse> {
        return this.titleService.getTitle(titleQueryData, type === 'id')
    }

    @Get('search')
    searchTitle(@Query('searchValue') searchValue: string): Promise<ISerializeResponse> {
        return this.titleService.searchTitle({ searchValue })
    }

    @Get('all')
    getTitleList(
        @Query() query: {
            author: string,
            tags: any,
            sortBy: 'hot' | 'top',
            skip: number,
        }
    ): Promise<ISerializeResponse> {
        if (query.tags?.split) query.tags = query.tags.split(',')
        return this.titleService.getTitleList(query)
    }

    @Get(':titleId/image')
    async getTitleImage(@Param('titleId') titleId,  @Res() res: any): Promise<void> {
        const buffer = await this.titleService.getTitleImage(titleId)
        res.type('image/jpeg').send(buffer)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @RateLimit({
        points: 3,
        duration: 60,
        errorMessage: 'You have reached the limit. You have to wait 60 seconds before trying again.'
    })
    @Post('create-title')
    async createTitle(@Headers('authorization') bearer: string, @Req() req) {
        return new Promise((resolve, reject) => {
            const payload: any = {}
            let image: Buffer

            const fileHandler = async (_field, file, _filename, _encoding, mimetype) => {
                if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
                    reject(new BadRequestException('File must be image'))
                    return
                }
                file.pipe(concat(buffer => image = buffer))
            }

            const mpForm = req.multipart(fileHandler, async (error) => {
                if (error) {
                    reject(new BadRequestException('Not valid multipart request'))
                    return
                }
                try {
                    const result = await this.titleService.createTitle(jwtManipulationService.decodeJwtToken(bearer, 'username'), payload, image)
                        .catch(e => {
                            // if titleService.createTitle fails, throw the error to catch block
                            throw e
                        })
                    resolve(result)
                } catch (e) {
                    reject(e)
                }
            })

            mpForm.on('field', (key, value) => {
                payload[key] = value
            })
        })
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @RateLimit({
        points: 3,
        duration: 60,
        errorMessage: 'You have reached the limit. You have to wait 60 seconds before trying again.'
    })
    @Put('/image')
    @Roles(Role.Admin)
    updateTitleImage(@Query('titleId') titleId, @Req() req): Promise<StatusOk> {
        return new Promise((resolve, reject) => {
            const handler = (_field, file, _filename, _encoding, mimetype) => {
                if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') reject(new BadRequestException('File must be image'))
                file.pipe(concat(buffer => {
                    this.titleService.updateTitleImage(titleId, buffer)
                        .catch(error => reject(error))
                }))
            }

            req.multipart(handler, (error) => {
                if (error) reject(new BadRequestException('Not valid multipart request'))
                resolve({ status: 'ok', message: 'Upload successfully ended' })
            })
        })
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @RateLimit({
        points: 3,
        duration: 60,
        errorMessage: 'You have reached the limit. You have to wait 60 seconds before trying again.'
    })
    @Delete('/image')
    @Roles(Role.Admin)
    deleteTitleImage(@Query('titleId') titleId): StatusOk {
        this.titleService.deleteTitleImage(titleId)
        return { status: 'ok', message: 'Image successfully deleted'}
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @RateLimit({
        points: 3,
        duration: 60,
        errorMessage: 'You have reached the limit. You have to wait 60 seconds before trying again.'
    })
    @Patch(':titleId')
    @Roles(Role.Admin)
    updateTitle(
        @Headers('authorization') bearer: string,
        @Param('titleId') titleId: string,
        @Body() dto: UpdateTitleDto,
    ): Promise<ISerializeResponse> {
        return this.titleService.updateTitle(jwtManipulationService.decodeJwtToken(bearer, 'username'), titleId, dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':titleId/rate')
    @Roles(Role.User)
    rateTitle(
        @Headers('authorization') bearer: string,
        @Param('titleId') titleId: string,
        @Body() dto: RateTitleDto
    ): Promise<StatusOk> {
        return this.titleService.rateTitle(jwtManipulationService.decodeJwtToken(bearer, 'username'), titleId, dto.rateValue)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get(':titleId/rate-of-user')
    @Roles(Role.User)
    getRateOfUser(
        @Headers('authorization') bearer: string,
        @Param('titleId') titleId: string,
    ): Promise<ISerializeResponse> {
        return this.titleService.getRateOfUser(jwtManipulationService.decodeJwtToken(bearer, 'username'), titleId)
    }

    @Get(':titleId/average-rate')
    getAvarageRate(@Param('titleId') titleId: string): Promise<ISerializeResponse> {
        return this.titleService.getAvarageRate(titleId)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':titleId')
    @Roles(Role.SuperAdmin)
    deleteTitle(@Param('titleId') titleId: string): Promise<StatusOk> {
        return this.titleService.deleteTitle(titleId)
    }
}

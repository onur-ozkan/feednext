// Nest dependencies
import { Controller, UseGuards, Headers, Post, Body, HttpException, Get, Param, Query, Delete, Patch } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport/dist/auth.guard'

// Local dependencies
import { RolesGuard } from 'src/shared/Guards/roles.guard'
import { CreateTitleDto } from '../Dto/create-title.dto'
import { currentUserService } from 'src/shared/Services/current-user.service'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { UpdateTitleDto } from '../Dto/update-title.dto'
import { JuniorAuthor, Admin, SuperAdmin } from 'src/shared/Constants'
import { ISerializeResponse } from 'src/shared/Services/serializer.service'
import { TitleService } from '../Service/title.service'

@ApiTags('v1/title')
@Controller()
@UseGuards(RolesGuard)
@Controller()
export class TitleController {
    constructor(private readonly titleService: TitleService) {}

    @Get(':titleSlug')
    getTitle(@Param('titleSlug') titleSlug: string): Promise<ISerializeResponse> {
        return this.titleService.getTitle(titleSlug)
    }

    @Get('all')
    getTitleList(@Query() query: { limit: number, skip: number, orderBy: any }): Promise<ISerializeResponse> {
        return this.titleService.getTitleList(query)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('create-title')
    @Roles(JuniorAuthor)
    createTitle(@Headers('authorization') bearer: string, @Body() dto: CreateTitleDto): Promise<HttpException | ISerializeResponse> {
        return this.titleService.createTitle(currentUserService.getCurrentUser(bearer, 'username'), dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':titleId')
    @Roles(Admin)
    updateTitle(
        @Headers('authorization') bearer: string,
        @Param('titleId') titleId: string,
        @Body() dto: UpdateTitleDto,
    ): Promise<ISerializeResponse> {
        return this.titleService.updateTitle(currentUserService.getCurrentUser(bearer, 'username'), titleId, dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':titleId')
    @Roles(SuperAdmin)
    deleteTitle(@Param('titleId') titleId: string): Promise<HttpException> {
        return this.titleService.deleteTitle(titleId)
    }
}

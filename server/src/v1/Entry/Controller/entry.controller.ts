// Nest dependencies
import { Controller, Headers, Get, Param, UseGuards, Post, Body, Query, Patch, Delete, HttpException } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

// Local files
import { EntryService } from '../Service/entry.service'
import { RolesGuard } from 'src/shared/Guards/roles.guard'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { CreateEntryDto } from '../Dto/create-entry.dto'
import { currentUserService } from 'src/shared/Services/current-user.service'
import { JuniorAuthor, Admin, SuperAdmin, User } from 'src/shared/Constants'
import { ISerializeResponse } from 'src/shared/Services/serializer.service'

@ApiTags('v1/entry')
@UseGuards(RolesGuard)
@Controller()
export class EntryController {
    constructor(private readonly entryService: EntryService) {}

    @Get(':entryId')
    getEntry(@Param('entryId') entryId: string): Promise<ISerializeResponse> {
        return this.entryService.getEntry(entryId)
    }

    @Get('all')
    getEntryList(@Query() query: { limit: number, skip: number, orderBy: any }): Promise<ISerializeResponse> {
        return this.entryService.getEntryList(query)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':entryId')
    @Roles(Admin)
    updateEntry(
        @Headers('authorization') bearer: string, @Param('entryId') entryId: string, @Body('text') text: string,
    ): Promise<ISerializeResponse> {
        return this.entryService.updateEntry(currentUserService.getCurrentUser(bearer, 'username'), entryId, text)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch('up-vote/:entryId')
    @Roles(User)
    upVoteEntry(
        @Param('entryId') entryId: string,
        @Headers('authorization') bearer: string,
    ): Promise<HttpException> {
        return this.entryService.voteEntry({entryId, username: currentUserService.getCurrentUser(bearer, 'username'), isUpVoted: true})
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch('down-vote/:entryId')
    @Roles(User)
    downVoteEntry(
        @Param('entryId') entryId: string,
        @Headers('authorization') bearer: string,
    ): Promise<HttpException> {
        return this.entryService.voteEntry({entryId, username: currentUserService.getCurrentUser(bearer, 'username'), isUpVoted: false})
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch('undo-vote/:entryId')
    @Roles(User)
    undoVoteEntry(
        @Param('entryId') entryId: string,
        @Query('isUpVoted') isUpVoted: string,
        @Headers('authorization') bearer: string,
    ): Promise<HttpException> {
        return this.entryService.undoVoteOfEntry({
            entryId,
            username: currentUserService.getCurrentUser(bearer, 'username'),
            isUpVoted: (isUpVoted === 'true')
        })
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('create-entry')
    @Roles(JuniorAuthor)
    createEntry(
        @Headers('authorization') bearer: string, @Body() dto: CreateEntryDto,
    ): Promise<HttpException | ISerializeResponse> {
        return this.entryService.createEntry(currentUserService.getCurrentUser(bearer, 'username'), dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':entryId')
    @Roles(SuperAdmin)
    deleteTitle(
        @Param('entryId') entryId: string): Promise<HttpException> {
        return this.entryService.deleteEntry(entryId)
    }
}

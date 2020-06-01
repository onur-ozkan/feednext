// Nest dependencies
import { Controller, Headers, Get, Param, UseGuards, Post, Body, Query, Patch, Delete, HttpException } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

// Local files
import { EntryService } from '../Service/entry.service'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { CreateEntryDto } from '../Dto/create-entry.dto'
import { jwtManipulationService } from 'src/shared/Services/jwt.manipulation.service'
import { ISerializeResponse } from 'src/shared/Services/serializer.service'
import { UpdateEntryDto } from '../Dto/update-entry.dto'
import { Role } from 'src/shared/Enums/Roles'
import { RateLimit } from 'nestjs-fastify-rate-limiter'

@ApiTags('v1/entry')
@Controller()
export class EntryController {
    constructor(private readonly entryService: EntryService) { }

    @Get(':entryId')
    getEntry(@Param('entryId') entryId: string): Promise<ISerializeResponse> {
        return this.entryService.getEntry(entryId)
    }

    @Get('by-author/:username/all')
    getEntriesByAuthorOfIt(
        @Param('username') username: string,
        @Query() query: { skip: number },
    ): Promise<any> {
        return this.entryService.getEntriesByAuthorOfIt({ username, query })
    }

    @Get('by-title/:titleId/all')
    getEntriesByTitleId(
        @Param('titleId') titleId: string,
        @Query() query: {
            skip: number,
            sortBy: 'newest' | 'top'
        },
    ): Promise<ISerializeResponse> {
        return this.entryService.getEntriesByTitleId({ titleId, query })
    }

    @Get('by-title/:titleId/featured')
    getFeaturedEntryByTitleId(
        @Param('titleId') titleId: string
    ): Promise<ISerializeResponse> {
        return this.entryService.getFeaturedEntryByTitleId({ titleId })
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @RateLimit({
        points: 3,
        duration: 60,
        errorMessage: 'You have reached the limit. You have to wait 60 seconds before trying again.'
    })
    @Patch(':entryId')
    updateEntry(
        @Headers('authorization') bearer: string, @Param('entryId') entryId: string, @Body() dto: UpdateEntryDto,
    ): Promise<ISerializeResponse> {
        return this.entryService.updateEntry(jwtManipulationService.decodeJwtToken(bearer, 'username'), entryId, dto.text)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch('up-vote/:entryId')
    @Roles(Role.User)
    upVoteEntry(
        @Param('entryId') entryId: string,
        @Headers('authorization') bearer: string,
    ): Promise<HttpException> {
        return this.entryService.voteEntry({ entryId, username: jwtManipulationService.decodeJwtToken(bearer, 'username'), isUpVoted: true })
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch('down-vote/:entryId')
    @Roles(Role.User)
    downVoteEntry(
        @Param('entryId') entryId: string,
        @Headers('authorization') bearer: string,
    ): Promise<HttpException> {
        return this.entryService.voteEntry({ entryId, username: jwtManipulationService.decodeJwtToken(bearer, 'username'), isUpVoted: false })
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch('undo-vote/:entryId')
    @Roles(Role.User)
    undoVoteEntry(
        @Param('entryId') entryId: string,
        @Query('isUpVoted') isUpVoted: string,
        @Headers('authorization') bearer: string,
    ): Promise<HttpException> {
        return this.entryService.undoVoteOfEntry({
            entryId,
            username: jwtManipulationService.decodeJwtToken(bearer, 'username'),
            isUpVoted: (isUpVoted === 'true')
        })
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @RateLimit({
        points: 1,
        duration: 60,
        errorMessage: 'You can only create 1 entry in 60 seconds'
    })
    @Post('create-entry')
    @Roles(Role.User)
    createEntry(
        @Headers('authorization') bearer: string, @Body() dto: CreateEntryDto,
    ): Promise<HttpException | ISerializeResponse> {
        return this.entryService.createEntry(jwtManipulationService.decodeJwtToken(bearer, 'username'), dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':entryId')
    deleteEntry(
        @Param('entryId') entryId: string,
        @Headers('authorization') bearer: string,
    ): Promise<HttpException> {
        const { username, role } = jwtManipulationService.decodeJwtToken(bearer, 'all')
        return this.entryService.deleteEntry(username, role, entryId)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete('all/:username')
    @Roles(Role.SuperAdmin)
    deleteEntriesBelongsToUsername(@Param('username') username: string): Promise<HttpException> {
        return this.entryService.deleteEntriesBelongsToUsername(username)
    }
}

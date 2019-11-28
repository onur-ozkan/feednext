import { Controller, Headers, Get, Param, HttpException, UseGuards, Post, Body } from '@nestjs/common'
import { EntryService } from '../Service/entry.service'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { RolesGuard } from 'src/shared/Guards/roles.guard'
import { AuthGuard } from '@nestjs/passport'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { CreateEntryDto } from '../Dto/create-entry.dto'
import { currentUserService } from 'src/shared/Services/current-user.service'

@ApiUseTags('v1/entry')
@UseGuards(RolesGuard)
@Controller()
export class EntryController {
    constructor(private readonly entryService: EntryService) {}

    @Get(':entryId')
    getEntry(@Param('entryId') entryId: string): Promise<HttpException> {
        return this.entryService.getEntry(entryId)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('create-entry')
    @Roles(1)
    createEntry(@Headers('authorization') bearer: string, @Body() dto: CreateEntryDto): Promise<HttpException> {
        return this.entryService.createEntry(currentUserService.getCurrentUser(bearer, 'username'), dto)
    }
}

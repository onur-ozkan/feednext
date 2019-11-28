import { Controller, Get, Param, HttpException, UseGuards } from '@nestjs/common'
import { EntryService } from '../Service/entry.service'
import { ApiUseTags } from '@nestjs/swagger'
import { RolesGuard } from 'src/shared/Guards/roles.guard'

@ApiUseTags('v1/entry')
@UseGuards(RolesGuard)
@Controller()
export class EntryController {
    constructor(private readonly entryService: EntryService) {}

    @Get(':entryId')
    getEntry(@Param('entryId') entryId: string): Promise<HttpException> {
        return this.entryService.getEntry(entryId)
    }
}

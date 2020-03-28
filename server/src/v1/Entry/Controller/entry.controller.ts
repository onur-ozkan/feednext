// Nest dependencies
import { Controller, Headers, Get, Param, UseGuards, Post, Body, Query, Patch, Delete, HttpException } from '@nestjs/common'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

// Local files
import { EntryService } from '../Service/entry.service'
import { RolesGuard } from 'src/shared/Guards/roles.guard'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { CreateEntryDto } from '../Dto/create-entry.dto'
import { currentUserService } from 'src/shared/Services/current-user.service'
import { JuniorAuthor, Admin, SuperAdmin } from 'src/shared/Constants'
import { ISerializeResponse } from 'src/shared/Services/serializer.service'

@ApiUseTags(`v1/entry`)
@UseGuards(RolesGuard)
@Controller()
export class EntryController {
    constructor(private readonly entryService: EntryService) {}

    @Get(`:entryId`)
    getEntry(@Param(`entryId`) entryId: string): Promise<ISerializeResponse> {
        return this.entryService.getEntry(entryId)
    }

    @Get(`all`)
    getEntryList(@Query() query: { limit: number, skip: number, orderBy: any }): Promise<ISerializeResponse> {
        return this.entryService.getEntryList(query)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(`jwt`))
    @Patch(`:entryId`)
    @Roles(Admin)
    updateCategory(
        @Headers(`authorization`) bearer: string, @Param(`entryId`) entryId: string, @Body(`text`) text: string,
    ): Promise<ISerializeResponse> {
        return this.entryService.updateEntry(currentUserService.getCurrentUser(bearer, `username`), entryId, text)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(`jwt`))
    @Post(`create-entry`)
    @Roles(JuniorAuthor)
    createEntry(
        @Headers(`authorization`) bearer: string, @Body() dto: CreateEntryDto
    ): Promise<HttpException | ISerializeResponse> {
        return this.entryService.createEntry(currentUserService.getCurrentUser(bearer, `username`), dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(`jwt`))
    @Delete(`:entryId`)
    @Roles(SuperAdmin)
    deleteProduct(@Param(`entryId`) entryId: string): Promise<ISerializeResponse> {
        return this.entryService.deleteEntry(entryId)
    }
}

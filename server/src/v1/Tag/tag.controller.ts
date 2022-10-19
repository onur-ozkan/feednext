// Nest dependencies
import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

// Local files
import { ISerializeResponse } from 'src/shared/Services/serializer.service'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { Role } from 'src/shared/Enums/Roles'
import { StatusOk } from 'src/shared/Types'
import { TagService } from './tag.service'

@ApiTags('v1/tag')
@Controller()
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get(':tagId')
    getTag(@Param('tagId') tagId: string): Promise<ISerializeResponse> {
        return this.tagService.getTag(tagId)
    }

    @Get('search')
    searchTag(@Query('searchValue') searchValue: string): Promise<ISerializeResponse> {
        return this.tagService.searchTag(searchValue)
    }

    @ApiBearerAuth()
    @Get('trending')
    getString(): Promise<ISerializeResponse> {
        return this.tagService.getTrendingTags()
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':tagId')
    @Roles(Role.SuperAdmin)
    deleteTag(@Param('tagId') tagId: string): Promise<StatusOk> {
        return this.tagService.deleteTag(tagId)
    }

}
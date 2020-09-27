// Nest dependencies
import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

// Local files
import { ISerializeResponse } from 'src/shared/Services/serializer.service'
import { TagService } from './tag.service'

@ApiTags('v1/tag')
@Controller()
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get(':categoryId')
    getCategory(@Param('categoryId') tagId: string): Promise<ISerializeResponse> {
        return this.tagService.getTag(tagId)
    }

    @ApiBearerAuth()
    @Get('trending')
    getString(): Promise<any> {
        return this.tagService.getTrending()
    }

}
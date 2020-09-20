// Nest dependencies
import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { TagService } from './tag.service'

// Local files

@ApiTags('v1/tag')
@Controller()
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @ApiBearerAuth()
    @Get('trending')
    getString(): Promise<any> {
        return this.tagService.getTrending()
    }

}

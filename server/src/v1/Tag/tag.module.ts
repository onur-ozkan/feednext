// Nest dependencies
import { Module } from '@nestjs/common'

// Local files
import { TagController } from './tag.controller'
import { TagService } from './tag.service'

@Module({
    imports: [],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService]
})

export class TagModule {}

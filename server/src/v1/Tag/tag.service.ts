// Nest dependencies
import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Other dependencies
import { Validator } from 'class-validator'

// Local files
import { ISerializeResponse, serializerService } from 'src/shared/Services/serializer.service'
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { TagsRepository } from 'src/shared/Repositories/tags.repository'
import { TagsEntity } from 'src/shared/Entities/tags.entity'
import { StatusOk } from 'src/shared/Types'

@Injectable()
export class TagService {
    private validator: Validator

    constructor(
        @InjectRepository(TagsRepository)
        private readonly tagRepository: TagsRepository,
        @InjectRepository(TitlesRepository)
        private readonly titleRepository: TitlesRepository,
    ) {
        this.validator = new Validator()
    }

    async getTag(tagId: string): Promise<ISerializeResponse> {
        if (!this.validator.isMongoId(tagId)) throw new BadRequestException('Id must be a type of MongoId')

        let tag
        try {
            tag = await this.tagRepository.findOneOrFail(tagId)
        }
        catch {
            throw new NotFoundException('Tag could not found by given id')
        }

        return serializerService.serializeResponse('tag_detail', tag)
    }

    async getTrending(): Promise<any> {
        // TODO
        return 'hey'
    }

    async deleteTag(tagId: string): Promise<StatusOk> {
        if (!this.validator.isMongoId(tagId)) throw new BadRequestException('Id must be a type of MongoId')

        let tag: TagsEntity | null
        try {
            tag = await this.tagRepository.findOneOrFail(tagId)
        }
        catch {
            throw new NotFoundException('Tag could not found by given id')
        }

        await this.titleRepository.deleteTagFromTitle(tag.name)
        await this.tagRepository.deleteTag(tag)

        return { status: 'ok', message: 'Tag has been deleted' }
    }
}
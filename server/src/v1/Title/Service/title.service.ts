// Nest dependencies
import { Injectable, HttpException, BadRequestException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// Local files
import { TitlesRepository } from 'src/shared/Repositories/title.repository'
import { CreateTitleDto } from '../Dto/create-title.dto'
import { TitlesEntity } from 'src/shared/Entities/titles.entity'
import { CategoriesRepository } from 'src/shared/Repositories/categories.repository'
import { UpdateTitleDto } from '../Dto/update-title.dto'
import { serializerService, ISerializeResponse } from 'src/shared/Services/serializer.service'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'

@Injectable()
export class TitleService {
    constructor(
        @InjectRepository(TitlesRepository)
        private readonly titlesRepository: TitlesRepository,
        @InjectRepository(CategoriesRepository)
        private readonly categoriesRepository: CategoriesRepository,
        @InjectRepository(EntriesRepository)
        private readonly entriesRepository: EntriesRepository,
    ) {}

    async getTitle(titleId: string): Promise<ISerializeResponse> {
        const title: TitlesEntity = await this.titlesRepository.getTitle(titleId)
        const id: string = String(title.id)
        delete title.id
        return serializerService.serializeResponse(`title_detail`, title, id)
    }

    async getTitleList(query: { limit: number, skip: number, orderBy: any }): Promise<ISerializeResponse> {
        const result: {titles: TitlesEntity[], count: number} = await this.titlesRepository.getTitleList(query)
        return serializerService.serializeResponse(`title_list`, result)
    }

    async createTitle(openedBy: string, dto: CreateTitleDto): Promise<HttpException | ISerializeResponse> {
        try {
          await this.categoriesRepository.findOneOrFail(dto.categoryId)
        } catch (err) {
          throw new BadRequestException(`Category with id:${dto.categoryId} does not match in database.`)
        }

        const newTitle: TitlesEntity = await this.titlesRepository.createTitle(openedBy, dto)
        return serializerService.serializeResponse(`title_detail`, newTitle)
    }

    async updateTitle(updatedBy: string, titleId: string, dto: UpdateTitleDto): Promise<ISerializeResponse> {
        const title: TitlesEntity = await this.titlesRepository.updateTitle(updatedBy, titleId, dto)
        const id: string = String(title.id)
        delete title.id
        return serializerService.serializeResponse(`title_detail`, title, id)
    }

    async deleteTitle(titleId: string): Promise<HttpException> {
        const title = await this.titlesRepository.deleteTitle(titleId)
        await this.entriesRepository.deleteEntriesBelongsToTitle(String(title.id))

        throw new HttpException('Title has been deleted.', HttpStatus.OK)
    }
}

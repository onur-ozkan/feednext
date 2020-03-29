// Nest dependencies
import { UnprocessableEntityException, BadRequestException, NotFoundException } from '@nestjs/common'

// Other dependencies
import { Repository, EntityRepository } from 'typeorm'
import { ObjectID } from 'mongodb'
import { Validator } from 'class-validator'

// Local files
import { TitlesEntity } from '../Entities/titles.entity'
import { CreateTitleDto } from 'src/v1/Title/Dto/create-title.dto'
import { UpdateTitleDto } from 'src/v1/Title/Dto/update-title.dto'

@EntityRepository(TitlesEntity)
export class TitlesRepository extends Repository<TitlesEntity> {

    private validator: ObjectID

    constructor() {
      super()
      this.validator = new Validator()
    }

    async getTitle(titleId: string): Promise<TitlesEntity> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException(`Id must be type of a MongoId.`)
        try {
            const title: TitlesEntity = await this.findOneOrFail(titleId)
            return title
        } catch (err) {
            throw new NotFoundException(`Title with that id could not found in the database.`)
        }
    }

    async updateEntryCount(titleId: string, isIncrement: boolean): Promise<void> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException(`Id must be type of a MongoId.`)
        try {
            const title: TitlesEntity = await this.findOneOrFail(titleId)
            isIncrement ? title.entry_count++ : title.entry_count--
            this.save(title)
        } catch (err) {
            throw new NotFoundException(`Title with that id could not found in the database.`)
        }
    }

    async getTitleList(query: { limit: number, skip: number, orderBy: any }): Promise<{titles: TitlesEntity[], count: number}> {
        const orderBy = query.orderBy || `ASC`

        try {
            const [titles, total] = await this.findAndCount({
                order: {
                    name: orderBy.toUpperCase(),
                },
                take: Number(query.limit) || 10,
                skip: Number(query.skip) || 0,
            })
            return {
                titles,
                count: total,
            }
        } catch (err) {
            throw new BadRequestException(err)
        }
    }

    async createTitle(openedBy: string, dto: CreateTitleDto): Promise<TitlesEntity> {
        const newTitle: TitlesEntity = new TitlesEntity({
            name: dto.name,
            category_id: dto.categoryId,
            opened_by: openedBy,
        })

        try {
            return await this.save(newTitle)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }
    }

    async updateTitle(updatedBy: string, titleId: string, dto: UpdateTitleDto): Promise<TitlesEntity> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException(`TitleId must be a MongoId.`)

        if (dto.categoryId) {
            if (!this.validator.isMongoId(dto.categoryId)) throw new BadRequestException(`TitleId must be a MongoId.`)

            try {
                await this.findOneOrFail(dto.categoryId)
            } catch (err) {
                throw new NotFoundException(`Category with that id could not found in the database.`)
            }
        }

        let title: TitlesEntity
        try {
            title = await this.findOneOrFail(titleId)
        } catch {
            throw new NotFoundException(`Title related to that id could not found in the database.`)
        }

        try {
            if (dto.name) title.name = dto.name
            if (dto.categoryId) title.category_id = dto.categoryId
            title.updated_by = updatedBy

            await this.save(title)
            return title
        } catch (err) {
            throw new BadRequestException(err.errmsg)
        }
    }

    async deleteTitle(titleId: string): Promise<TitlesEntity> {
        if (!this.validator.isMongoId(titleId)) throw new BadRequestException(`Id must be type of a MongoId.`)
        try {
            const title: TitlesEntity = await this.findOneOrFail(titleId)
            await this.delete(title)
            return title
        } catch (err) {
            throw new NotFoundException(`Title with that id could not found in the database.`)
        }
    }
}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EntriesEntity } from 'src/shared/Entities/entries.entity'
import { EntriesRepository } from 'src/shared/Repositories/entries.repository'
import { EntryService } from './Service/entry.service'
import { EntryController } from './Controller/entry.controller'
import { ProductsRepository } from 'src/shared/Repositories/products.repository'

@Module({
    imports: [TypeOrmModule.forFeature([EntriesEntity, EntriesRepository, ProductsRepository])],
    providers: [EntryService],
    exports: [EntryService],
    controllers: [EntryController],
})

export class EntryModule {}

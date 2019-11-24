import { Repository, EntityRepository } from 'typeorm'
import { EntriesEntity } from '../Entities/entries.entity'

@EntityRepository(EntriesEntity)
export class EntriesRepository extends Repository<EntriesEntity> {}

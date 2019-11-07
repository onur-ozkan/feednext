import { Repository, EntityRepository } from 'typeorm'
import { CategoriesEntity } from '../Entities/categories.entity'

@EntityRepository(CategoriesEntity)
export class CategoriesRepository extends Repository<CategoriesEntity> {}

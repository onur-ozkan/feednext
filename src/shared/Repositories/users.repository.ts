import { Repository, EntityRepository } from 'typeorm'
import { UsersEntity } from '../Entities/users.entity'

@EntityRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity> {}

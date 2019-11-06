import { Repository, EntityRepository } from 'typeorm'
import { UserEntity } from '../Entities/users.entity'

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}

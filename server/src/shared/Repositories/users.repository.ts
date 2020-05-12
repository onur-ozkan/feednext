// Nest dependencies
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common'

// Other dependencies
import { createHmac } from 'crypto'
import { Repository, EntityRepository } from 'typeorm'
import * as jwt from 'jsonwebtoken'
import * as kmachine from 'keymachine'

// Local files
import { UsersEntity } from '../Entities/users.entity'
import { UpdateUserDto } from 'src/v1/User/Dto/update-user.dto'
import { CreateAccountDto } from 'src/v1/Auth/Dto/create-account.dto'
import { LoginDto } from 'src/v1/Auth/Dto/login.dto'
import { AccountRecoveryDto } from 'src/v1/Auth/Dto/account-recovery.dto'
import { configService } from '../Services/config.service'

@EntityRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity> {

    constructor() {
      super()
    }

    async getUserByUsername(username: string): Promise<UsersEntity> {
        try {
            const profile: UsersEntity = await this.findOneOrFail({ username })
            return profile
        } catch (err) {
            throw new BadRequestException('User could not found')
        }
    }

    async getUserByEmail(emailParam: string): Promise<UsersEntity> {
        try {
            return await this.findOneOrFail({ email: emailParam })
        } catch (err) {
            throw new BadRequestException('This email does not exist in the database.')
        }
    }

    async searchUserByUsername({ searchValue } : { searchValue: string }): Promise<{ users: UsersEntity[] }> {
        const [users] = await this.findAndCount({
            where: {
                username: new RegExp(searchValue, 'i')
            },
            take: 5,
            order: {
                full_name: 'ASC'
            }
        })

        return { users }
    }

    async validateUser(dto: LoginDto): Promise<UsersEntity> {
        const passwordHash: string = createHmac('sha256', dto.password).digest('hex')
        try {
            return await this.findOneOrFail({
                where: {
                    $or: [
                        {
                            email: dto.email,
                        },
                        {
                            username: dto.username,
                        },
                    ],
                    password: passwordHash
                }
            })
        } catch (err) {
            throw new BadRequestException('No account found by given credentials.')
        }
    }

    async createUser(dto: CreateAccountDto): Promise<UsersEntity> {
        const newUser: UsersEntity = new UsersEntity({
            email: dto.email,
            username: dto.username,
            password: dto.password,
            full_name: dto.fullName,
        })

        try {
            return await this.save(newUser)
        } catch (err) {
            throw new UnprocessableEntityException(err.errmsg)
        }
    }

    async updateUser(username: string, dto: UpdateUserDto): Promise<UsersEntity> {
        let profile: UsersEntity

        try {
            profile = await this.findOneOrFail({
                username
            })
        } catch (error) {
            throw new BadRequestException('Account does not exist')
        }

        if (dto.fullName) profile.full_name = dto.fullName
        if (dto.link) profile.link = dto.link
        if (dto.biography) profile.biography = dto.biography
        if (dto.password) {
            const hashedPassword = createHmac('sha256', dto.password).digest('hex')
            if (profile.password !== createHmac('sha256', dto.oldPassword).digest('hex')) {
                throw new BadRequestException('Old password does not match')
            }
            profile.password = hashedPassword
        }

        return await this.save(profile)
    }

    async triggerRefreshToken(query: string): Promise<string> {
        const profile: UsersEntity = await this.findOneOrFail({
            where: {
                $or: [
                    {
                        email: query,
                    },
                    {
                        username: query,
                    },
                ]
            }
        })
        profile.refresh_token = jwt.sign({
            username: profile.username,
            iat: Date.now()
        }, configService.getEnv('SECRET_FOR_REFRESH_TOKEN'))
        await this.save(profile)

        return profile.refresh_token
    }

    async verifyUpdateEmail(decodedToken: { email: string, username: string, newEmail: string }): Promise<void>  {
        try {
            const account: UsersEntity = await this.findOneOrFail({
                email: decodedToken.email,
                username: decodedToken.username,
            })

            account.email = decodedToken.newEmail
            await this.save(account)
        } catch (err) {
            throw new BadRequestException('Incoming token is not valid.')
        }
    }

    async disableUser(username: string): Promise<void>  {
        let profile: UsersEntity

        try {
             profile = await this.findOneOrFail({
                username,
            })
        } catch (err) {
            throw new BadRequestException('User could not found')
        }

        profile.is_active = false
        await this.save(profile)
    }

    async activateUser(decodedToken: { email: string, username: string }): Promise<void>  {
        try {
          const account: UsersEntity = await this.findOneOrFail({
              email: decodedToken.email,
              username: decodedToken.username,
          })

          account.is_active = true
          await this.save(account)
        } catch (err) {
            throw new BadRequestException('Incoming token is not valid.')
        }
    }

    async accountRecovery(dto: AccountRecoveryDto): Promise<{ account: UsersEntity, password: string }> {
        let account: UsersEntity

        try {
            account = await this.findOneOrFail({ email: dto.email })
        } catch (err) {
            throw new BadRequestException('This email does not exist in the database')
        }

        if (!account.is_verified) throw new BadRequestException('Account is not verified, please verify your accunt')
        else if (!account.is_active) throw new BadRequestException('Account is not active')

        const generatePassword: string = await kmachine.keymachine()
        account.password = createHmac('sha256', generatePassword).digest('hex')
        return {
            account: await this.save(account),
            password: generatePassword,
        }
    }

    async accountVerification(decodedToken: { email: string, username: string}): Promise<void>  {
        try {
            const account: UsersEntity = await this.findOneOrFail({
                email: decodedToken.email,
                username: decodedToken.username,
            })

            account.is_verified = true
            await this.save(account)
        } catch (err) {
            throw new BadRequestException('Incoming token is not valid.')
        }
    }

}

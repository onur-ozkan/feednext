// Nest dependencies
import { Routes } from 'nest-router'

// Local files
import { V1Module } from './v1/v1.module'
import { AuthModule } from './v1/Auth/auth.module'
import { EntryModule } from './v1/Entry/entry.module'
import { UserModule } from './v1/User/user.module'
import { TitleModule } from './v1/Title/title.module'
import { MessageModule } from './v1/Message/message.module'
import { TagModule } from './v1/Tag/tag.module'

export const versionRoutes: Routes = [
    {
        path: '/v1',
        module: V1Module,
        children: [
            {
                path: '/auth',
                module: AuthModule,
            },
            {
                path: '/user',
                module: UserModule,
            },
            {
                path: '/tag',
                module: TagModule
            },
            {
                path: '/title',
                module: TitleModule,
            },
            {
                path: '/entry',
                module: EntryModule,
            },
            {
                path: '/message',
                module: MessageModule,
            }
        ],
    },
  ]

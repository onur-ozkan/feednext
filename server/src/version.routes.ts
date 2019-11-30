// Nest dependencies
import { Routes } from 'nest-router'

// Local files
import { V1Module } from './v1/v1.module'
import { AuthModule } from './v1/Auth/auth.module'
import { CategoryModule } from './v1/Category/category.module'
import { EntryModule } from './v1/Entry/entry.module'
import { ProductModule } from './v1/Product/product.module'
import { UserModule } from './v1/User/user.module'

export const versionRoutes: Routes = [
    {
        path: `/v1`,
        module: V1Module,
        children: [
            {
                path: `/auth`,
                module: AuthModule,
            },
            {
                path: `/category`,
                module: CategoryModule,
            },
            {
                path: `/entry`,
                module: EntryModule,
            },
            {
                path: `/product`,
                module: ProductModule,
            },
            {
                path: `/user`,
                module: UserModule,
            },
        ],
    },
  ]

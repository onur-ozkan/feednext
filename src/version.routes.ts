import { Routes } from 'nest-router'
import { ApiModule } from './v1/api.module'
import { AuthModule } from './v1/auth/auth.module'
import { CategoriesModule } from './v1/categories/categories.module'
import { EntriesModule } from './v1/entries/entries.module'
import { ProductsModule } from './v1/products/products.module'
import { UsersModule } from './v1/users/users.module'

export const versionRoutes: Routes = [
    {
        path: `/v1`,
        module: ApiModule,
        children: [
            {
                path: `/auth`,
                module: AuthModule,
            },
            {
                path: `/categories`,
                module: CategoriesModule,
            },
            {
                path: `/entries`,
                module: EntriesModule,
            },
            {
                path: `/products`,
                module: ProductsModule,
            },
            {
                path: `/users`,
                module: UsersModule,
            },
        ],
    },
  ]

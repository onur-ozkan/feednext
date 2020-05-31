// Nest dependencies
import { Controller, Post, Body, UseGuards, Param, Get, Delete, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

// Local files
import { RolesGuard } from 'src/shared/Guards/roles.guard'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { CreateCategoryDto } from '../Dto/create-category.dto'
import { CategoryService } from '../Service/category.service'
import { UpdateCategoryDto } from '../Dto/update-category.dto'
import { ISerializeResponse } from 'src/shared/Services/serializer.service'
import { Role } from 'src/shared/Enums/Roles'

@ApiTags('v1/category')
@UseGuards(RolesGuard)
@Controller()
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @Get(':categoryId')
    getCategory(@Param('categoryId') categoryId: string): Promise<ISerializeResponse> {
        return this.categoryService.getCategory(categoryId)
    }

    @Get('main-categories')
    getMainCategories(): Promise<ISerializeResponse> {
        return this.categoryService.getMainCategories()
    }

    @Get(':categoryId/child-categories')
    getChildCategories(@Param('categoryId') categoryId: string): Promise<ISerializeResponse> {
        return this.categoryService.getChildCategories(categoryId)
    }

    @Get('trending-categories')
    getTrendingCategories(): Promise<ISerializeResponse> {
        return this.categoryService.getTrendingCategories()
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @Roles(Role.SuperAdmin)
    createCategory(@Body() dto: CreateCategoryDto): Promise<ISerializeResponse> {
        return this.categoryService.createCategory(dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':categoryId')
    @Roles(Role.Admin)
    updateCategory(@Param('categoryId') categoryId: string, @Body() dto: UpdateCategoryDto): Promise<ISerializeResponse> {
        return this.categoryService.updateCategory(categoryId, dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete(':categoryId')
    @Roles(Role.SuperAdmin)
    deleteCategory(@Param('categoryId') categoryId: string): Promise<ISerializeResponse> {
        return this.categoryService.deleteCategory(categoryId)
    }
}

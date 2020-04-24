// Nest dependencies
import { Controller, Post, Body, UseGuards, Param, Get, Delete, Query, Patch } from '@nestjs/common'
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
@Controller()
@UseGuards(RolesGuard)
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @Get(':categoryId')
    getCategory(@Param('categoryId') categoryId: string): Promise<ISerializeResponse> {
        return this.categoryService.getCategory(categoryId)
    }

    @Get('all')
    getCategoryList(@Query() query: { limit: number, skip: number }): Promise<ISerializeResponse> {
        return this.categoryService.getCategoryList(query)
    }

    @Get('trending-categories')
    getTrendingCategories(): Promise<any> {
        return this.categoryService.getTrendingCategories()
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('create-category')
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

// Nest dependencies
import { Controller, Post, Body, HttpException, UseGuards, Param, Get, Delete, Query, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'

// Local files
import { RolesGuard } from 'src/shared/Guards/roles.guard'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { CreateCategoryDto } from '../Dto/create-category.dto'
import { CategoryService } from '../Service/category.service'
import { UpdateCategoryDto } from '../Dto/update-category.dto'
import { SeniorAuthor, Admin, SuperAdmin } from 'src/shared/Constants'

@ApiUseTags(`v1/category`)
@Controller()
@UseGuards(RolesGuard)
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @Get(`:categoryId`)
    getCategory(@Param(`categoryId`) categoryId: string): Promise<HttpException> {
        return this.categoryService.getCategory(categoryId)
    }

    @Get(`all`)
    getCategoryList(@Query() query: { limit: number, skip: number, orderBy: any }): Promise<HttpException> {
        return this.categoryService.getCategoryList(query)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(`jwt`))
    @Post(`create-category`)
    @Roles(SeniorAuthor)
    createCategory(@Body() dto: CreateCategoryDto): Promise<HttpException> {
        return this.categoryService.createCategory(dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(`jwt`))
    @Patch(`:categoryId`)
    @Roles(Admin)
    updateCategory(@Param(`categoryId`) categoryId: string, @Body() dto: UpdateCategoryDto): Promise<HttpException> {
        return this.categoryService.updateCategory(categoryId, dto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(`jwt`))
    @Delete(`:categoryId`)
    @Roles(SuperAdmin)
    deleteCategory(@Param(`categoryId`) categoryId: string): Promise<HttpException> {
        return this.categoryService.deleteCategory(categoryId)
    }
}

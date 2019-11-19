import { Controller, Post, Body, HttpException, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { CreateCategoryDto } from '../Dto/create-category.dto'
import { CategoryService } from '../Service/category.service'

@ApiUseTags('v1/category')
@Controller()
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('create-category')
    createCategory(@Body() dto: CreateCategoryDto): Promise<HttpException> {
        return this.categoryService.createCategory(dto)
    }
}

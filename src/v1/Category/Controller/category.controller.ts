import { Controller, Post, Body, HttpException, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { RolesGuard } from 'src/shared/Guards/roles.guard'
import { Roles } from 'src/shared/Decorators/roles.decorator'
import { CreateCategoryDto } from '../Dto/create-category.dto'
import { CategoryService } from '../Service/category.service'

@ApiUseTags('v1/category')
@Controller()
@UseGuards(RolesGuard)
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('create-category')
    @Roles(3)
    createCategory(@Body() dto: CreateCategoryDto): Promise<HttpException> {
        return this.categoryService.createCategory(dto)
    }
}

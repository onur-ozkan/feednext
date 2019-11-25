import { Controller, UseGuards, Headers, Post, Body, HttpException } from '@nestjs/common'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { RolesGuard } from 'src/shared/Guards/roles.guard'
import { ProductService } from '../Service/product.service'
import { CreateProductDto } from '../Dto/create-product.dto'
import { currentUserService } from 'src/shared/Services/current-user.service'
import { AuthGuard } from '@nestjs/passport/dist/auth.guard'
import { Roles } from 'src/shared/Decorators/roles.decorator'

@ApiUseTags('v1/product')
@Controller()
@UseGuards(RolesGuard)
@Controller()
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Post('create-product')
    @Roles(1)
    createProduct(@Headers('authorization') bearer: string, @Body() dto: CreateProductDto): Promise<HttpException> {
        return this.productService.createProduct(currentUserService.getCurrentUser(bearer, 'username'), dto)
    }
}

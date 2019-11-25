import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, Length, IsMongoId } from 'class-validator'

export class CreateProductDto {
    @ApiModelProperty({
        required: true,
        example: 'Example Name',
    })
    @IsNotEmpty()
    @Length(60)
    productName: string

    @ApiModelProperty({
      required: false,
      example: '507f1f77bcf86cd799439011',
    })
    @IsMongoId()
    @IsOptional()
    categoryId: string
}

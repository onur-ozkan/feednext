import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsMongoId, MaxLength } from 'class-validator'

export class CreateProductDto {
    @ApiModelProperty({
        required: true,
        example: 'Example Name',
    })
    @IsNotEmpty()
    @MaxLength(60)
    name: string

    @ApiModelProperty({
        required: true,
        example: '507f1f77bcf86cd799439011',
    })
    @IsMongoId()
    categoryId: string
}

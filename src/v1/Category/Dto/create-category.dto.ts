import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength, IsOptional, IsMongoId } from 'class-validator'

export class CreateCategoryDto {
    @ApiModelProperty({
        required: true,
        example: 'Example Name',
    })
    @IsNotEmpty()
    @MaxLength(50)
    categoryName: string

    @ApiModelProperty({
      example: '507f1f77bcf86cd799439011',
    })
    @IsNotEmpty()
    @IsMongoId()
    @IsOptional()
    @MaxLength(50)
    parentCategoryId: string

}

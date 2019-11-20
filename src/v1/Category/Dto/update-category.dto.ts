import { ApiModelProperty } from '@nestjs/swagger'
import { MaxLength, IsOptional, IsMongoId, IsBoolean } from 'class-validator'

export class UpdateCategoryDto {
    @ApiModelProperty({
        required: false,
        example: 'Example Name',
    })
    @IsOptional()
    @MaxLength(50)
    categoryName: string

    @ApiModelProperty({
      required: false,
      example: '507f1f77bcf86cd799439011',
    })
    @IsOptional()
    @IsMongoId()
    parentCategoryId: string

    @ApiModelProperty({
      required: false,
      example: 'true || false',
    })
    @IsBoolean()
    @IsOptional()
    is_lowest_cateogry: boolean
}

// Nest dependencies
import { ApiModelProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, MaxLength, IsOptional, IsMongoId, IsBoolean } from 'class-validator'

export class CreateCategoryDto {
    @ApiModelProperty({
        required: true,
        example: `Example Name`,
    })
    @IsNotEmpty()
    @MaxLength(50)
    categoryName: string

    @ApiModelProperty({
      required: false,
      example: `507f1f77bcf86cd799439011`,
    })
    @IsMongoId()
    @IsOptional()
    parentCategoryId: string

    @ApiModelProperty({
      required: false,
      example: `true || false`,
    })
    @IsBoolean()
    @IsOptional()
    is_lowest_cateogry: boolean
}

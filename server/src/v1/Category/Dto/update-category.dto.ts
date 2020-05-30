// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { MaxLength, IsOptional, IsMongoId, IsBoolean } from 'class-validator'

export class UpdateCategoryDto {
    @ApiProperty({
        required: false,
        example: 'Example Name',
    })
    @IsOptional()
    @MaxLength(50)
    categoryName: string

    @ApiProperty({
      required: true,
      example: false
    })
    @IsOptional()
    @IsBoolean()
    isLeaf: boolean

    @ApiProperty({
      required: false,
      example: '507f1f77bcf86cd799439011',
    })
    @IsOptional()
    @IsMongoId()
    parentCategoryId: string
}

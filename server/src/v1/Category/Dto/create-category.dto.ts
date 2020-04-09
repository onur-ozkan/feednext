// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, MaxLength, IsOptional, IsMongoId } from 'class-validator'

export class CreateCategoryDto {
    @ApiProperty({
        required: true,
        example: 'Electronic',
    })
    @IsNotEmpty()
    @MaxLength(50)
    categoryName: string

    @ApiProperty({
      required: false,
      example: '507f1f77bcf86cd799439011',
    })
    @IsMongoId()
    @IsOptional()
    parentCategoryId: string
}

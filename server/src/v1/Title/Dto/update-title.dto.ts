// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, IsMongoId, MaxLength, IsOptional } from 'class-validator'

export class UpdateTitleDto {
    @ApiProperty({
        required: true,
        example: 'Phone Y',
    })
    @IsNotEmpty()
    @MaxLength(60)
    name: string

    @ApiProperty({
        required: false,
        example: '507f1f77bcf86cd799439011',
    })
    @IsOptional()
    @IsMongoId()
    categoryId: string
}

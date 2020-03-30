// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, IsMongoId, MaxLength } from 'class-validator'

export class CreateTitleDto {
    @ApiProperty({
        required: true,
        example: 'Phone X',
    })
    @IsNotEmpty()
    @MaxLength(60)
    name: string

    @ApiProperty({
        required: true,
        example: '507f1f77bcf86cd799439011',
    })
    @IsMongoId()
    categoryId: string
}

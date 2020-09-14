// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, MaxLength, IsOptional } from 'class-validator'

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
        example: '"electronics", "phone", "samsung"'
    })
    @IsOptional()
    tags: string[]
}

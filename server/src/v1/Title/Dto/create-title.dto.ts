// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, Length, IsArray } from 'class-validator'

export class CreateTitleDto {
    @ApiProperty({
        required: true,
        example: 'Phone X',
    })
    @IsNotEmpty()
    @Length(3 ,75)
    name: string

    @ApiProperty({
        required: true,
        example: '["electronics", "phone", "samsung"]'
    })
    @IsArray()
    tags: string[]
}

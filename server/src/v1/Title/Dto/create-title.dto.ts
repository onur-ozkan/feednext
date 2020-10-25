// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, Length, IsArray, MinLength, NotContains } from 'class-validator'

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
    @NotContains(' ', {
        each: true,
    })
    @MinLength(3, {
        each: true,
    })
    @IsArray()
    tags: string[]
}

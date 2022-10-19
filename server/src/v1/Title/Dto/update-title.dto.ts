// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, MaxLength, IsOptional, MinLength, NotContains } from 'class-validator'

export class UpdateTitleDto {
    @ApiProperty({
        required: true,
        example: 'Phone Y',
    })
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(60)
    name: string

    @ApiProperty({
        required: false,
        example: '"electronics", "phone", "samsung"'
    })
    @NotContains(' ', {
        each: true,
    })
    @MinLength(3, {
        each: true,
    })
    @IsOptional()
    tags: string[]
}

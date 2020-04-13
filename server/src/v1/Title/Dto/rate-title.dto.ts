// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, Min, Max } from 'class-validator'

export class RateTitleDto {
    @ApiProperty({
        required: true,
        example: 3,
    })
    @IsNotEmpty()
    @Min(0)
    @Max(5)
    rateValue: number
}

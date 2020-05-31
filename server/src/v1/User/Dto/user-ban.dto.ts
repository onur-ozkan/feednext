// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsBoolean } from 'class-validator'

export class UserBanDto {
    @ApiProperty({
        required: true,
        example: true,
    })
    @IsBoolean()
    banSituation: boolean
}

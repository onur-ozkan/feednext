// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, Matches } from 'class-validator'

export class GenerateRecoveryKeyDto {
    @ApiProperty({
        required: true,
        example: 'demo@demo.com',
    })
    @IsNotEmpty()
    @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
        message: 'Email must be a type of email'
    })
    email: string
}

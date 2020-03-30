// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsEmail, IsNotEmpty } from 'class-validator'

export class AccountRecoveryDto {
    @ApiProperty({
        required: true,
        example: 'demo@demo.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string
}

// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { Matches } from 'class-validator'

export class ActivateUserDto {
    @ApiProperty({
        required: true,
        example: 'updated@demo.com',
    })
    @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
        message: 'Email must be a type of email'
    })
    email: string
}

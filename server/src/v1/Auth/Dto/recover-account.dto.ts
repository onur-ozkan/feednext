// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, Matches, NotContains, Length } from 'class-validator'

export class RecoverAccountDto {
    @ApiProperty({
        required: true,
        example: 'demo@demo.com',
    })
    @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
        message: 'Email must be a type of email'
    })
    email: string

    @ApiProperty({
        required: true,
        example: 'axg16z',
    })
    @IsNotEmpty()
    recoveryKey: string

    @ApiProperty({
        required: true,
        example: 'demo123',
    })
    @IsNotEmpty()
    @NotContains(' ')
    @Length(6, 20)
    password: string
}

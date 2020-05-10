// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsEmail, IsNotEmpty, NotContains, Length, MaxLength, Matches } from 'class-validator'

export class CreateAccountDto {
    @ApiProperty({
        required: true,
        example: 'Demo User',
    })
    @IsNotEmpty()
    @MaxLength(50)
    fullName: string

    @ApiProperty({
        required: true,
        example: 'demo@demo.com',
    })
    @IsEmail()
    email: string

    @ApiProperty({
        required: true,
        example: 'demo_user',
    })
    @IsNotEmpty()
    @Matches(/^[a-z0-9_.-]{3,17}$/)
    @NotContains(' ')
    username: string

    @ApiProperty({
        required: true,
        example: 'demo123',
    })
    @IsNotEmpty()
    @NotContains(' ')
    @Length(6, 15)
    password: string
}

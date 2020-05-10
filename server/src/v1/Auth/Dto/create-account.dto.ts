// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, NotContains, Length, MaxLength, Matches } from 'class-validator'

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
    @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
        message: 'Email must be a type of email'
    })
    email: string

    @ApiProperty({
        required: true,
        example: 'demo_user',
    })
    @IsNotEmpty()
    @Matches(/^[a-z0-9_.-]{3,17}$/, {
        // tslint:disable-next-line:quotemark
        message: "Your username can only contain letters, numbers, '_', '-' and '.' "
    })
    username: string

    @ApiProperty({
        required: true,
        example: 'demo123',
    })
    @IsNotEmpty()
    @NotContains(' ')
    @Length(6, 20)
    password: string
}

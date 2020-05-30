// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsNotEmpty, NotContains, Length, Matches } from 'class-validator'

export class CreateAccountDto {
    @ApiProperty({
        required: true,
        example: 'Demo User',
    })
    @Matches(/^(?!\s*$).+/, {
        message: 'Name can not be empty or whitespace'
    })
    @Length(3, 50)
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
        message: "Username can only contain lowercase letters, numbers, '_', '-' and '.' with min 3 max 17 length"
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

// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsOptional, Length, MaxLength, NotContains, IsNotEmpty, ValidateIf, Matches } from 'class-validator'

export class UpdateUserDto {
    @ApiProperty({
        required: false,
        example: 'Updated Name',
    })
    @IsOptional()
    @Matches(/^(?!\s*$).+/, {
        message: 'Name can not be empty or whitespace'
    })
    @Length(3, 50)
    fullName: string

    @ApiProperty({
        required: false,
        example: 'updated@demo.com',
    })
    @IsOptional()
    @Matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, {
        message: 'Email must be a type of email'
    })
    email: string

    @ApiProperty({
        required: false,
        example: 'https://twitter.com/_ozkanonur',
    })
    @IsOptional()
    @MaxLength(90)
    link: string

    @ApiProperty({
        required: false,
        example: 'Demo User, X Years old.',
    })
    @IsOptional()
    @MaxLength(155)
    biography: string

    @ApiProperty({
        required: false,
        example: 'demo123',
    })
    @IsOptional()
    @NotContains(' ')
    @Length(6, 15)
    password: string

    @ApiProperty({
        required: true,
        example: '123demo',
    })
    @ValidateIf(o => o.password !== undefined )
    @IsNotEmpty()
    @NotContains(' ')
    @Length(6, 15)
    oldPassword: string
}

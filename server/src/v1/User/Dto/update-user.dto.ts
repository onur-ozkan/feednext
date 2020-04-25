// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsEmail, IsOptional, Length, MaxLength, NotContains, IsNotEmpty, ValidateIf } from 'class-validator'

export class UpdateUserDto {
    @ApiProperty({
        required: false,
        example: 'Updated Name',
    })
    @IsOptional()
    @MaxLength(50)
    fullName: string

    @ApiProperty({
        required: false,
        example: 'updated@demo.com',
    })
    @IsOptional()
    @IsEmail()
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

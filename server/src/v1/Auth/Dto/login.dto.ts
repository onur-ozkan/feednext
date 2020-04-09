// Nest dependencies
import { ApiProperty } from '@nestjs/swagger'

// Other dependencies
import { IsEmail, IsNotEmpty, IsOptional, IsBoolean, IsString } from 'class-validator'

export class LoginDto {
    @ApiProperty({
        required: false,
        example: 'demo@demo.com',
    })
    @IsOptional()
    @IsEmail()
    email: string

    @ApiProperty({
        required: false,
        example: 'demo_user',
    })
    @IsOptional()
    username: string

    @ApiProperty({
        required: true,
        example: true
    })
    @IsBoolean()
    rememberMe: boolean

    @ApiProperty({
        required: true,
        example: 'demo123',
    })
    @IsNotEmpty()
    @IsString()
    password: string
}

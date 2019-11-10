import { ApiModelProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, Length, MaxLength, NotContains } from 'class-validator'

export class UpdateUserDto {
    @ApiModelProperty({
        required: false,
        example: 'Example Name',
    })
    @IsOptional()
    @IsNotEmpty()
    @MaxLength(50)
    fullName: string

    @ApiModelProperty({
        required: false,
        example: 'example@gmail.com',
    })
    @IsOptional()
    @IsEmail()
    email: string

    @ApiModelProperty({
        required: false,
        example: 'your_password123',
    })
    @IsOptional()
    @IsNotEmpty()
    @NotContains(' ')
    @Length(6, 15)
    password: string
}

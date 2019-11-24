import { ApiModelProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, Length, MaxLength, NotContains, IsNotEmpty, ValidateIf } from 'class-validator'

export class UpdateUserDto {
    @ApiModelProperty({
        required: false,
        example: 'Example Name',
    })
    @IsOptional()
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
        required: true,
        example: 'your_password123',
    })
    @ValidateIf(o => o.password !== undefined )
    @IsNotEmpty()
    @NotContains(' ')
    @Length(6, 15)
    oldPassword: string

    @ApiModelProperty({
        required: false,
        example: 'your_password123',
    })
    @IsOptional()
    @NotContains(' ')
    @Length(6, 15)
    password: string
}

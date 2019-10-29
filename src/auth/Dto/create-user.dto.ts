import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiModelProperty({
    required: true,
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiModelProperty({
    required: true,
    example: 'Example Name',
  })
  @IsNotEmpty()
  fullName: string;

  @ApiModelProperty({
    required: true,
    example: 'your_username',
  })
  @IsNotEmpty()
  username: string;

  @ApiModelProperty({
    required: true,
    example: 'your_password123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

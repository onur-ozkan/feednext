import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiModelProperty({
    required: false,
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiModelProperty({
    required: false,
    example: 'your_username',
  })
  username: string;

  @ApiModelProperty({
    required: true,
    example: 'your_password123',
  })
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}

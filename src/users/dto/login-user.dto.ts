import { IsNotEmpty, IsEmail } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty()
  readonly username?: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email?: string;

  @IsNotEmpty()
  readonly password: string;
}

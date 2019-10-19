import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  readonly fullName: string;

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly email: string;
}

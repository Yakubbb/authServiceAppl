import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ValidateIf(o => !o.email)
  login?: string;

  @IsEmail()
  @IsNotEmpty()
  @ValidateIf(o => !o.login)
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
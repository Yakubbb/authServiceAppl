import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  login: string;

  @IsEmail({}, { message: 'Пожалуйста, введите корректный email' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Пароль слишком слабый. Он должен содержать заглавные и строчные буквы, а также цифры или спецсимволы.',
  })
  password: string;
}
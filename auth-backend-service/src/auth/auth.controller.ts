import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.Dto';

@Controller('auth')
export class AuthController {
  authService: any;
  @Post('register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    console.log('Приняты данные для регистрации:', createUserDto);
    const user = await this.authService.register(createUserDto);
    console.log('Пользователь успешно создан в БД:', user);
    return {
      message: 'Пользователь успешно зарегистрирован',
      user,
    };
  }
}
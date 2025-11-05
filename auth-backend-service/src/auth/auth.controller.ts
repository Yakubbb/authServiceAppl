import { Controller, Post, Body, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { changeProfileNameDto } from './dto/changeProfileName.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return {
      message: 'Пользователь успешно зарегистрирован',
    };
  }
  @Post('login')
  async login(@Body(new ValidationPipe()) createUserDto: LoginUserDto) {
    const token = await this.authService.login(createUserDto);
    return {
      message: token,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('changeProfileName')
  async changeProfileName(
    @Request() req,
    @Body(new ValidationPipe()) changeProfileNameDto: changeProfileNameDto
  ) {
    const userId = req.user.id;
    await this.authService.changeProfileName(userId, changeProfileNameDto.new_username);

    return {
      message: `Имя пользователя с ID ${userId} успешно изменено.`,
    };
  }
}
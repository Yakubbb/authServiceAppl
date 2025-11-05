import { Controller, Post, Body, ValidationPipe, UseGuards, Request, Get } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { changeProfileNameDto } from './dto/changeProfileName.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: 'Зарегистрировать нового пользователя' })
  @Post('register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return {
      message: 'Пользователь успешно зарегистрирован',
    };
  }
  @Post('login')
  @ApiOperation({ summary: 'Войти в систему и получить JWT токен' })
  async login(@Body(new ValidationPipe()) createUserDto: LoginUserDto) {
    const token = await this.authService.login(createUserDto);
    return {
      message: token,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить имя пользователя по ID из JWT токена' })
  @Get('username')
  async getUserNameById(@Request() req) {
    const userId = req.user.id;
    const name = await this.authService.getUserNameById(userId);
    return {
      message: name,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Изменить имя пользователя' })
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
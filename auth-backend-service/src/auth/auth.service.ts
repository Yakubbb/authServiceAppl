import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<string> {
    const { login, email, password, username } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { login }],
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email или login уже существует.');
    }

    const user = this.usersRepository.create({
      login,
      email,
      username,
      password,
    });

    await this.usersRepository.save(user);
    
    return 'пользователь успешно зарегистрирован';
  }
}
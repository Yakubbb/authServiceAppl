import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(createUserDto: CreateUserDto): Promise<string> {
        const { login, email, password, username } = createUserDto;

        const existingUser = await this.usersRepository.findOne({
            where: [{ email }, { login }],
        });

        if (existingUser) {
            throw new ConflictException('Пользователь с таким email или login уже существует.');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.usersRepository.create({
            login,
            email,
            username,
            salt: salt,
            password: hashedPassword,
        });

        await this.usersRepository.save(user);

        return 'пользователь успешно зарегистрирован';
    }

    async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
        const { login, email, password } = loginUserDto;

        const user = await this.usersRepository.findOne({
            where: [{ login }, { email }],
        });

        if (user) {
            const isPasswordMatching = await bcrypt.compare(password, user.password);
            if (isPasswordMatching) {
                const payload = { username: user.username, sub: user.id };
                const accessToken = this.jwtService.sign(payload);
                return { accessToken };
            }
        }

        throw new UnauthorizedException('Пожалуйста, проверьте ваши учетные данные');
    }

    async changeProfileName(userId: number, newUsername: string): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        user.username = newUsername;
        return this.usersRepository.save(user);
    }

    async getUserNameById(userId: number): Promise<string> {
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        return user.username
    }
}
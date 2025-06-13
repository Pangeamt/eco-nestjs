import {HttpException, HttpStatus, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {CreateUserDto, LoginUserDto } from './dto';
import {OnModuleInit} from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('AuthService');
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to database');
    }

    async register(createAuthDto :  CreateUserDto) {
        try {
            const existingUser = await this.user.findUnique({
                where: {
                    email: createAuthDto.email
                }
            });

            if (existingUser) {
                throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
            }

            const user = await this.user.create({
                data: {
                    ...createAuthDto,
                    role: 'USER',
                    password:  bcrypt.hashSync(createAuthDto.password, 10)
                }
            });
            return {user:{
              ...user,
                password: undefined
            }};
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async login(loginAuthDto : LoginUserDto) {
        try {
            const user = await this.user.findUnique({
                where: {
                    email: loginAuthDto.email
                },
                select: {
                    id: true,
                    email: true,
                    password: true
                }
            });
            if (!user) {
                throw new UnauthorizedException('Email does not exist');
            }
            const isPasswordValid = bcrypt.compareSync(loginAuthDto.password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException ('Password is not valid'); 
            }
            return {user:{
                ...user,
                password: undefined
            }}
        }
        catch (error) {
            this.logger.error(error);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST); 
        }
    }


}

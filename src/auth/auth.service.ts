import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  async register(createAuthDto: CreateAuthDto) {
    try {
      const existingUser = await this.user.findUnique({
        where: {
          email: createAuthDto.email,
        },
      });

      if (existingUser) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      const user = await this.user.create({
        data: {
          ...createAuthDto,
          role: 'USER',
        },
      }); 
      return {
        user,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST); 
    }
  }
}

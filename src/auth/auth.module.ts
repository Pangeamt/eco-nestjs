import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        console.log(envs.JWT_SECRET);
        return {
          secret: envs.JWT_SECRET,
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
  ],
})
export class AuthModule {}

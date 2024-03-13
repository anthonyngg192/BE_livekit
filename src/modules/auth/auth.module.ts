import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppEnvironmentService } from 'src/common/environment';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { UserRepositoryModule } from '../user/repositories/user.repository.module';

@Module({
  imports: [
    UserModule,
    UserRepositoryModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (envService: AppEnvironmentService) => ({
        secret: envService.ENVIRONMENT.JWT_SECRET_KEY,
        signOptions: {
          expiresIn: '1y',
        },
      }),
      inject: [AppEnvironmentService],
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}

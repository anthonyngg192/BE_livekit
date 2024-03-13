import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthController } from 'src/modules/auth/controllers/auth.controller';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
})
export class AuthRoutesModule {}

import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthGuard, AuthLocal } from '../decorators/auth.decorator';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from '../dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDTO } from '../dto/signup.dto';

@ApiTags('Auth')
@Controller({
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @AuthLocal()
  async login(@Request() req, @Body() _login: LoginDTO) {
    return this.authService.successLogin(req.user);
  }

  @Post('logout')
  @AuthGuard()
  async logout(@Request() _req) {
    return '';
  }

  @Post('signup')
  async signUp(@Body() dto: SignUpDTO) {
    return this.authService.signUp(dto);
  }
}

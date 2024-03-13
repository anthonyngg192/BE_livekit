import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { AppEnvironmentService } from 'src/common/environment';
import { JwtPayloadDTO } from '../dto/jwt-payload.dto';
import { omit } from 'lodash';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService, protected envService: AppEnvironmentService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envService.ENVIRONMENT.JWT_SECRET_KEY,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayloadDTO) {
    const user = await this.authService.validateJwtPayload(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    return omit(user, ['password']);
  }
}

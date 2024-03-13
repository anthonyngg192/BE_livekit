import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDTO } from '../dto/login.dto';
import * as CryptoJS from 'crypto-js';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/modules/user/repositories/models/user.model';
import { omit, pick } from 'lodash';
import { JwtPayloadDTO } from '../dto/jwt-payload.dto';
import { AppEnvironmentService } from 'src/common/environment';
import { SignUpDTO } from '../dto/signup.dto';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly envService: AppEnvironmentService,
  ) {}

  async validateUser({ email, password }: LoginDTO) {
    const user = await this.userRepo.findOne({ email });
    if (!user) {
      return null;
    }
    const passwordHashed = CryptoJS.HmacSHA1(password, this.envService.ENVIRONMENT.JWT_SECRET_KEY).toString();
    console.log(passwordHashed);
    return passwordHashed === user.password ? user : null;
  }

  successLogin(user: UserModel) {
    return {
      token: this.jwtService.sign(pick(user, ['_id', 'email']), {
        expiresIn: '1y',
      }),
      profile: omit(user, ['password']),
    };
  }

  async validateJwtPayload(payload: JwtPayloadDTO) {
    if (!payload) return null;
    return await this.userRepo.findById(payload._id);
  }

  async signUp({ email, password }: SignUpDTO) {
    const isUserExisted = await this.userRepo.findOne({ email });
    if (isUserExisted) {
      throw new BadRequestException('Email existed');
    }

    const passwordHashed = CryptoJS.HmacSHA1(password, this.envService.ENVIRONMENT.JWT_SECRET_KEY).toString();

    await this.userService.createUser({ email, password: passwordHashed });
  }
}

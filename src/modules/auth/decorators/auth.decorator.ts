import { UseGuards, applyDecorators } from '@nestjs/common';
import { LocalAuthGuard } from '../guars/local.guard';
import { JWTAuthGuard } from '../guars/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export const AuthLocal = () => {
  return applyDecorators(UseGuards(LocalAuthGuard));
};

export const AuthGuard = () => {
  return applyDecorators(ApiBearerAuth(), UseGuards(JWTAuthGuard));
};

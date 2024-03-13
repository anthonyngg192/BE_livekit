import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser({ email, password }) {
    return this.userRepo.insert({ email, password });
  }
}

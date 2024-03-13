import { Controller, Get } from '@nestjs/common';
import { LivekitService } from '../services/livekit.service';

@Controller()
export class LivekitController {
  constructor(private readonly livekitService: LivekitService) {}

  @Get('get-token')
  async getToken() {
    return this.livekitService.generateToken();
  }
}

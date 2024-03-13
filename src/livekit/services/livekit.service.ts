import { Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';
import { AppEnvironmentService } from 'src/common/environment';

@Injectable()
export class LivekitService {
  private at: AccessToken;
  constructor(protected envService: AppEnvironmentService) {
    this.at = new AccessToken(
      envService.ENVIRONMENT.LIVEKIT_API_KEY,
      envService.ENVIRONMENT.LIVEKIT_API_SECRET,
      {
        ttl: '10m',
        identity: 'quickstart-username',
      },
    );
  }

  async generateToken() {
    this.at.addGrant({ roomJoin: true, room: 'first-room' });
    const token = await this.at.toJwt();
    return { token };
  }
}

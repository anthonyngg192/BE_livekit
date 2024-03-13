import { Injectable } from '@nestjs/common';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';
import { AppEnvironmentService } from 'src/common/environment';
@Injectable()
export class LivekitService {
  private at: AccessToken;

  private roomService: RoomServiceClient;
  constructor(protected envService: AppEnvironmentService) {
    this.roomService = new RoomServiceClient(
      envService.ENVIRONMENT.LIVEKIT_HOST,
      envService.ENVIRONMENT.LIVEKIT_API_KEY,
      envService.ENVIRONMENT.LIVEKIT_API_SECRET,
    );
  }

  async joinRoom({ roomName, userId }) {
    this.at = new AccessToken(
      this.envService.ENVIRONMENT.LIVEKIT_API_KEY,
      this.envService.ENVIRONMENT.LIVEKIT_API_SECRET,
      {
        ttl: '1h',
        identity: userId,
      },
    );
    this.at.addGrant({ roomJoin: true, room: roomName });
    const token = await this.at.toJwt();
    return { token };
  }

  async deleteRoom(roomName: string) {
    this.roomService.deleteRoom(roomName);
  }

  async createRoom(roomName: string) {
    const room = await this.roomService.createRoom({
      name: roomName,
      emptyTimeout: 60 * 60,
      maxParticipants: 20,
    });

    return room;
  }

  async listParticipantsRoom(roomName: string) {
    return await this.roomService.listParticipants(roomName);
  }
}

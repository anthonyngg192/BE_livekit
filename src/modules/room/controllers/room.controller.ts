import { Controller, Delete, Param, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoomService } from '../services/room.service';
import { AuthGuard } from 'src/modules/auth/decorators/auth.decorator';

@ApiTags('Room')
@Controller({
  path: 'room',
  version: '1',
})
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('new')
  @AuthGuard()
  async newRoom(@Request() req) {
    return this.roomService.createRoom(req.user, { allowJoined: true });
  }

  @Post(':roomName/join')
  @AuthGuard()
  async joinRoom(@Request() req, @Param('roomName') roomName: string) {
    return this.roomService.joinRoom(req.user, roomName);
  }

  @Delete(':roomName/complete')
  @AuthGuard()
  async endRoom(@Request() req, @Param('roomName') roomName: string) {
    return this.roomService.endRoom(req.user, roomName);
  }
}

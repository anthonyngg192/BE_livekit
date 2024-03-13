import { BadRequestException, Injectable } from '@nestjs/common';
import { RoomRepository } from '../repositories/room.repository';
import { UserModel } from 'src/modules/user/repositories/models/user.model';
import { LivekitService } from 'src/modules/livekit/services/livekit.service';
import { nanoid } from 'nanoid/async';
@Injectable()
export class RoomService {
  constructor(private readonly roomRepo: RoomRepository, private readonly livekitService: LivekitService) {}

  async createRoom(user: UserModel, { allowJoined }) {
    const roomName = await nanoid();
    this.livekitService.createRoom(roomName);

    const room = await this.roomRepo.insert({
      roomName,
      owner: user._id,
      participants: [user._id],
      allowJoined,
    });

    const token = await this.livekitService.joinRoom({ roomName, userId: user._id });

    return { room, token };
  }

  async joinRoom(user: UserModel, roomName: string) {
    const room = await this.roomRepo.findOne({ roomName });
    if (!room || room.endAt) {
      throw new BadRequestException('Room not found');
    }

    if (room.allowJoined) {
      const isAllowJoinRoom = room.participants.find((x) => x.toString() === user._id);
      if (!isAllowJoinRoom) {
        throw new BadRequestException('You can not join to  this room');
      }
    } else {
      this.roomRepo.updateOne(
        { _id: room._id },
        {
          $push: {
            participants: user._id,
          },
        },
      );
    }
    const token = await this.livekitService.joinRoom({ roomName, userId: user._id });
    return token;
  }

  async endRoom(user: UserModel, roomName: string) {
    const room = await this.roomRepo.findOne({ roomName, endAt: { $exists: false } });

    if (!room) {
      throw new BadRequestException('Room not found.');
    }

    if (room.owner.toString() !== user._id) {
      throw new BadRequestException(`Limited rooms's permissions.`);
    }
    await Promise.all([
      this.roomRepo.updateOne({ _id: room._id }, { $set: { endAt: Date.now() } }),
      this.livekitService.deleteRoom(roomName),
    ]);
  }
}

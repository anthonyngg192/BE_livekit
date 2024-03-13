import { Injectable } from '@nestjs/common';
import { WebhookReceiver } from 'livekit-server-sdk';
import { AppEnvironmentService } from 'src/common/environment';
import { RoomHistoryRepository } from 'src/modules/room/repositories/room-history.repository';
import { WebhookSevenDocs } from '../docs/webhook-event.docs';
@Injectable()
export class LivekitHookService {
  protected receiver: WebhookReceiver;
  constructor(
    protected envService: AppEnvironmentService,
    protected readonly roomHistoryRepo: RoomHistoryRepository,
  ) {
    this.receiver = new WebhookReceiver(
      envService.ENVIRONMENT.LIVEKIT_API_KEY,
      envService.ENVIRONMENT.LIVEKIT_API_SECRET,
    );
  }

  async onReceiveEvent(_body: WebhookSevenDocs, _token: string) {
    // const event = this.receiver.receive(body, token);
    console.log(_body);
  }
}

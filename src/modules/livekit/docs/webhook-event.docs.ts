import { Room, ParticipantInfo, TrackInfo, EgressInfo, IngressInfo } from 'livekit-server-sdk';

export interface WebhookSevenDocs {
  id: string;
  createdAt: number;
  event: string;
  room: Room;
  participant: ParticipantInfo;
  track: TrackInfo;
  egressInfo: EgressInfo;
  ingressInfo: IngressInfo;
}

export class EmitSocketDTO {
  type: string;
  values: string[];
  event: string;
  data: any;
}

export class ConnectedSocketDTO {
  userId: string;
  token: string;
  connected: boolean;
}

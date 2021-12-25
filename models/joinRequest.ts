export interface JoinRequest {
  type: string;
  cmdr: string;
  discord: string;
  platform: Platform;
}

export enum Platform {
  PC = '0',
  Xbox = '1',
  PS = '2',
}

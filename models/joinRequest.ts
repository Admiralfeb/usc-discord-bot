export interface JoinRequest {
  type: string;
  cmdr: string;
  discord: string;
  platform: Platform;
}

export enum Platform {
  PC,
  Xbox,
  PS,
}

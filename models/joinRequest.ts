export interface JoinRequest {
  type: string;
  cmdr: string;
  discord: string;
  platforms: {
    pc: boolean;
    xbox: boolean;
    ps: boolean;
  };
}

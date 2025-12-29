export interface PongResponse {
  pong: string;
}

export interface IPingPongService {
  getPong(): PongResponse;
}

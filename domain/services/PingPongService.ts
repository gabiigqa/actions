import { IPingPongService, PongResponse } from '@/domain/interfaces/domain/services/IPingoService';
import { injectable } from 'inversify';

@injectable()
export class PingPongService implements IPingPongService {
  getPong(): PongResponse {
    const currentTime = new Date().toISOString();
    return {
      pong: currentTime
    };
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async isDbReady(): Promise<boolean> {
    try {
      // @todo: add logic to test kafka queue
      return true;
    } catch (error) {
      return false;
    }
  }
}

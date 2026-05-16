import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger(RabbitmqService.name);

  async publishEvent(eventType: string, payload: Record<string, unknown>) {
    this.logger.log(
      `[stub] publish ${eventType} -> ${JSON.stringify(payload)}`,
    );
  }
}
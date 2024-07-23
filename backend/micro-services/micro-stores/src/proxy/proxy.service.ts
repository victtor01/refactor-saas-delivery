import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  RmqContext,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ProxyService {
  private configure(queue: string): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@127.0.0.1:5673'],
        queue: queue,
      },
    });
  }

  public async confirmMessage(context: RmqContext) {
    try {
      const originalMsg = context.getMessage();
      const channel = await context.getChannelRef();

      await channel.ack(originalMsg);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async rejectMessage(context: RmqContext) {
    try {
      const originalMsg = context.getMessage();
      const channel = await context.getChannelRef();

      await channel.nack(originalMsg, false, false);
    } catch (error) {
      throw new Error(error);
    }
  }

  configureProxy(queue: string): ClientProxy {
    return this.configure(queue);
  }
}

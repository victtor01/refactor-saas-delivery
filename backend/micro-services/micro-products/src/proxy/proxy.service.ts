import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';

type SendMessageProps = {
  data: any;
  queue: string;
  action: string | Object;
  timeOut?: number;
  callbackError?: (error: any) => any;
};

@Injectable()
export class ProxyService {
  private _url = 'amqp://guest:guest@127.0.0.1:5673';

  private configure(queue: string): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this._url],
        queue: queue,
      },
    });
  }

  public configureToClients(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this._url],
        queue: 'clients',
      },
    });
  }

  public async configureToQueue(queue: string): Promise<ClientProxy> {
    try {
      const client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [this._url],
          queue,
        },
      });

      return client;
    } catch (error) {
      throw new BadGatewayException('Erro de conexão!');
    }
  }

  public async sendMessage<T = any>({
    timeOut = 5000,
    ...props
  }: SendMessageProps): Promise<T> {
    const { queue, data, action, callbackError } = props;
    const client = await this.configureToQueue(queue);

    const response =
      (await firstValueFrom(
        client.send(action, data).pipe(
          timeout(timeOut),
          catchError((err: HttpException) => {
            if (!callbackError) throw new BadGatewayException(err.message);
            return callbackError(err);
          }),
        ),
      )) || null;

    return response;
  }

  public confirmMessage(context: RmqContext) {
    try {
      const originalMsg = context.getMessage();
      const channel = context.getChannelRef();
      channel.ack(originalMsg);
    } catch (error) {
      throw new Error(error);
    }
  }

  configureProxy(queue: string): ClientProxy {
    return this.configure(queue);
  }
}

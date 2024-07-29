import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@127.0.0.1:5673'],
      queue: 'clients',
      noAck: false,
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  const logger = new Logger('MICRO_CLIENTS')
  logger.debug('INICIADO MICROSERVICE')
  await app.listen();
}
bootstrap();

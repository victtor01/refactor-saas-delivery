import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@127.0.0.1:5673'],
      queue: 'admin',
      noAck: false,
    },
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.startAllMicroservices();

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })

  const logger = new Logger('MAIN');

  logger.debug('Iniciado a api-gateway')

  await app.listen(8080);
}
bootstrap();

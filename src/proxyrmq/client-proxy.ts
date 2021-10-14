import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientProxySmartRanking {
  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RABBIT_MQ_USER}:${process.env.RABBIT_MQ_PASS}@${process.env.RABBIT_MQ_IP}:${process.env.RABBIT_MQ_PORT}/smartranking`,
        ],
        queue: 'admin-backend',
      },
    });
  }
}

import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Logger,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CriarCategoriaDto } from './dtos/criarCategoria.dto';

@Controller('api/v1')
export class AppController {
  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RABBIT_MQ_USER}:${process.env.RABBIT_MQ_PASS}@${process.env.RABBIT_MQ_IP}:${process.env.RABBIT_MQ_PORT}/smartranking`,
        ],
        queue: 'admin-backend',
      },
    });
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  async criarCategoria(@Body() criarCategoriaDto: CriarCategoriaDto) {
    return await this.clientAdminBackend.emit(
      'criar-categoria',
      criarCategoriaDto,
    );
  }
}

import {
  Controller,
  Logger,
  Post,
  Get,
  Put,
  UsePipes,
  Param,
  Query,
  Body,
  Delete,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { ValidationParametersPipe } from 'src/common/pipes/validacaoParametros.pipe';
import { CriarJogadorDto } from './dtos/criarJogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizarJogagor.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  private logger = new Logger(JogadoresController.name);

  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    this.logger.log(`criarJogadorDto: ${JSON.stringify(criarJogadorDto)}`);

    const categoria = await this.clientAdminBackend.send(
      'consultar-categorias',
      criarJogadorDto.categoria,
    );

    if (categoria) {
      this.clientAdminBackend.emit('criar-jogador', criarJogadorDto);
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`);
    }
  }

  @Get()
  consultarJogadores(@Query('idJogador') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
    @Param('_id', ValidationParametersPipe) _id: string,
  ) {
    const categoria = await this.clientAdminBackend.send(
      'consultar-categorias',
      atualizarJogadorDto.categoria,
    );

    if (categoria) {
      this.clientAdminBackend.emit('atualizar-jogador', {
        id: _id,
        jogador: atualizarJogadorDto,
      });
    } else {
      throw new BadRequestException(`Categoria não cadastrada!`);
    }
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id', ValidationParametersPipe) _id: string) {
    await this.clientAdminBackend.emit('deletar-jogador', { _id });
  }
}

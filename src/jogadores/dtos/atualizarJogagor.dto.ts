import { IsNotEmpty } from 'class-validator';

export class AtualizarJogadorDto {
  @IsNotEmpty()
  readonly nome: string;

  @IsNotEmpty()
  readonly telefoneCelular: string;

  @IsNotEmpty()
  readonly categoria: string;
}

import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCpfOrCnpj } from '@/shared/validators/is-cpf-or-cnpj';

export class CreateProducerDTO {
  @ApiProperty({
    description: 'The name of the producer',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'CPF or CNPJ of the producer',
    example: '12345678901',
  })
  @IsNotEmpty({ message: 'CPF or CNPJ is required' })
  @IsString({ message: 'cpfCnpj must be a string' })
  @IsCpfOrCnpj({ message: 'Invalid CPF or CNPJ' })
  cpfCnpj: string;
}

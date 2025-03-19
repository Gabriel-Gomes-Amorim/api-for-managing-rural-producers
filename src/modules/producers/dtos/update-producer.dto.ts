import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProducerDTO {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'CPF must have 11 digits or CNPJ must have 14 digits',
  })
  cpfCnpj?: string;
}

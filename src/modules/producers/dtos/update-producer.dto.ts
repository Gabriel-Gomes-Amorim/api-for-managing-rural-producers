import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProducerDTO {
  @ApiProperty({
    description: 'The name of the producer',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiProperty({
    description: 'CPF or CNPJ of the producer',
    example: '12345678901',
  })
  @IsOptional()
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'CPF must have 11 digits or CNPJ must have 14 digits',
  })
  cpfCnpj?: string;
}

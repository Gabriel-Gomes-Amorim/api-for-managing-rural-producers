import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFarmDTO {
  @ApiProperty({
    description: 'The name of the farm',
    example: 'Farm A',
  })
  @IsOptional({ message: 'Farm name is optional' })
  @IsString({ message: 'Farm name must be a string' })
  name: string;

  @ApiProperty({
    description: 'The city where the farm is located',
    example: 'City A',
  })
  @IsOptional({ message: 'City is optional' })
  @IsString({ message: 'City must be a string' })
  city: string;

  @ApiProperty({
    description: 'The state where the farm is located',
    example: 'State A',
  })
  @IsOptional({ message: 'State is optional' })
  @IsString({ message: 'State must be a string' })
  state: string;

  @ApiProperty({
    description: 'The total area of the farm in hectares',
    example: 1000,
  })
  @IsOptional({ message: 'Total area is optional' })
  @IsNumber({}, { message: 'Total area must be a number' })
  totalArea: number;

  @ApiProperty({
    description: 'The farmable area in hectares',
    example: 800,
  })
  @IsOptional({ message: 'Farmable area is optional' })
  @IsNumber({}, { message: 'Farmable area must be a number' })
  farmableArea: number;

  @ApiProperty({
    description: 'The area of vegetation in hectares',
    example: 200,
  })
  @IsOptional({ message: 'Vegetation area is optional' })
  @IsNumber({}, { message: 'Vegetation area must be a number' })
  vegetationArea: number;

  @ApiProperty({
    description: 'The ID of the producer associated with the farm',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional({ message: 'ProducerId is optional' })
  @IsUUID('4', { message: 'ProducerId must be a valid UUIDv4' })
  producerId: string;
}

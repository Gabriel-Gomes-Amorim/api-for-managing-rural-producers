import { IsNotEmpty, IsString, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmDTO {
  @ApiProperty({
    description: 'The name of the farm',
    example: 'Farm A',
  })
  @IsNotEmpty({ message: 'Farm name is required' })
  @IsString({ message: 'Farm name must be a string' })
  name: string;

  @ApiProperty({
    description: 'The city where the farm is located',
    example: 'City A',
  })
  @IsNotEmpty({ message: 'City is required' })
  @IsString({ message: 'City must be a string' })
  city: string;

  @ApiProperty({
    description: 'The state where the farm is located',
    example: 'State A',
  })
  @IsNotEmpty({ message: 'State is required' })
  @IsString({ message: 'State must be a string' })
  state: string;

  @ApiProperty({
    description: 'The total area of the farm in hectares',
    example: 1000,
  })
  @IsNotEmpty({ message: 'Total area is required' })
  @IsNumber({}, { message: 'Total area must be a number' })
  totalArea: number;

  @ApiProperty({
    description: 'The farmable area in hectares',
    example: 800,
  })
  @IsNotEmpty({ message: 'Farmable area is required' })
  @IsNumber({}, { message: 'Farmable area must be a number' })
  farmableArea: number;

  @ApiProperty({
    description: 'The area of vegetation in hectares',
    example: 200,
  })
  @IsNotEmpty({ message: 'Vegetation area is required' })
  @IsNumber({}, { message: 'Vegetation area must be a number' })
  vegetationArea: number;

  @ApiProperty({
    description: 'The ID of the producer associated with the farm',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'ProducerId is required' })
  @IsUUID('4', { message: 'ProducerId must be a valid UUIDv4' })
  producerId: string;
}

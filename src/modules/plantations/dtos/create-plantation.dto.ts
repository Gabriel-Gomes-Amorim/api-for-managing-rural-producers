import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlantationDTO {
  @ApiProperty({
    description: 'The name of the plantation',
    example: 'Soybean',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'The ID of the harvest associated with the plantation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'HarvestId is required' })
  @IsUUID('4', { message: 'HarvestId must be a valid UUIDv4' })
  harvestId: string;
}

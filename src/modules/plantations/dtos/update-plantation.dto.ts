import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlantationDTO {
  @ApiProperty({
    description: 'The name of the plantation',
    example: 'Soybean',
  })
  @IsOptional({ message: 'Name is optional' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'The ID of the harvest associated with the plantation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional({ message: 'HarvestId is optional' })
  @IsUUID('4', { message: 'HarvestId must be a valid UUIDv4' })
  harvestId: string;
}

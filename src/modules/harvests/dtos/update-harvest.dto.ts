import { IsInt, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHarvestDTO {
  @ApiProperty({
    description: 'The year of the harvest',
    example: 2021,
  })
  @IsOptional({ message: 'Year is required' })
  @IsInt({ message: 'Year must be an integer' })
  year: number;

  @ApiProperty({
    description: 'The ID of the farm associated with the harvest',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional({ message: 'FarmId is required' })
  @IsUUID('4', { message: 'FarmId must be a valid UUIDv4' })
  farmId: string;
}

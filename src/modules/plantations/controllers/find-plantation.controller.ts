import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindPlantationService } from '../services/find-plantation.service';
import { IPlantation } from '../entities/plantation.entity';

@Controller('plantations')
@ApiTags('plantations')
export class FindPlantationController {
  constructor(private readonly findPlantationService: FindPlantationService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async find(@Param('id') id: string) {
    const plantation: IPlantation =
      await this.findPlantationService.execute(id);

    return {
      status: true,
      statusCode: HttpStatus.OK,
      data: plantation,
    };
  }
}

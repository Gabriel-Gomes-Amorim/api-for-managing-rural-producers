import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindHarvestService } from '../services/find-harvest.service';
import { IHarvest } from '../entities/harvest.entity';

@Controller('harvests')
@ApiTags('harvests')
export class FindHarvestController {
  constructor(private readonly findHarvestService: FindHarvestService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async find(@Param('id') id: string) {
    const harvest: IHarvest = await this.findHarvestService.execute(id);

    return {
      status: true,
      statusCode: HttpStatus.OK,
      data: harvest,
    };
  }
}

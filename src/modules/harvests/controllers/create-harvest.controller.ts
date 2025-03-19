import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateHarvestDTO } from '../dtos/create-harvest.dto';
import { CreateHarvestService } from '../services/create-harvest.service';
import { IHarvest } from '../entities/harvest.entity';

@Controller('harvests')
@ApiTags('harvests')
export class CreateHarvestController {
  constructor(private readonly createHarvestService: CreateHarvestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateHarvestDTO) {
    const harvest: IHarvest = await this.createHarvestService.execute(data);

    return {
      status: true,
      statusCode: HttpStatus.CREATED,
      data: harvest,
    };
  }
}

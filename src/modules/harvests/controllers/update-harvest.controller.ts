import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateHarvestService } from '../services/update-harvest.service';
import { IHarvest } from '../entities/harvest.entity';
import { UpdateHarvestDTO } from '../dtos/update-harvest.dto';

@Controller('harvests')
@ApiTags('harvests')
export class UpdateHarvestController {
  constructor(private readonly updateHarvestService: UpdateHarvestService) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() data: UpdateHarvestDTO) {
    const harvest: IHarvest = await this.updateHarvestService.execute(data, id);

    return {
      status: true,
      statusCode: HttpStatus.OK,
      data: harvest,
    };
  }
}

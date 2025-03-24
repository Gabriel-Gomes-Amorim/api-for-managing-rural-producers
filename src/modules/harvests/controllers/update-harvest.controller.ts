import { Body, Controller, HttpStatus, Param, Put, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateHarvestService } from '../services/update-harvest.service';
import { IHarvest } from '../entities/harvest.entity';
import { UpdateHarvestDTO } from '../dtos/update-harvest.dto';
import { Response } from 'express';

@Controller('harvests')
@ApiTags('harvests')
export class UpdateHarvestController {
  constructor(private readonly updateHarvestService: UpdateHarvestService) {}

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateHarvestDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const harvest: IHarvest = await this.updateHarvestService.execute(data, id);

    return res.status(HttpStatus.OK).json({
      status: true,
      data: harvest,
    });
  }
}

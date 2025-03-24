import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindHarvestService } from '../services/find-harvest.service';
import { IHarvest } from '../entities/harvest.entity';
import { Response } from 'express';

@Controller('harvests')
@ApiTags('harvests')
export class FindHarvestController {
  constructor(private readonly findHarvestService: FindHarvestService) {}

  @Get(':id')
  async find(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    const harvest: IHarvest = await this.findHarvestService.execute(id);

    return res.status(HttpStatus.OK).json({
      status: true,
      data: harvest,
    });
  }
}

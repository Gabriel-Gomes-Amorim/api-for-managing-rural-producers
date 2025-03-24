import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindFarmService } from '../services/find-farm.service';
import { IFarm } from '../entities/farm.entity';
import { Response } from 'express';

@Controller('farms')
@ApiTags('farms')
export class FindFarmController {
  constructor(private readonly findFarmService: FindFarmService) {}

  @Get(':id')
  async find(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    const farm: IFarm = await this.findFarmService.execute(id);

    return res.status(HttpStatus.OK).json({
      status: true,
      data: farm,
    });
  }
}

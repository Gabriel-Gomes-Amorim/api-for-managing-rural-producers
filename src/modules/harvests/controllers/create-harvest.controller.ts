import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateHarvestDTO } from '../dtos/create-harvest.dto';
import { CreateHarvestService } from '../services/create-harvest.service';
import { IHarvest } from '../entities/harvest.entity';
import { Response } from 'express';

@Controller('harvests')
@ApiTags('harvests')
export class CreateHarvestController {
  constructor(private readonly createHarvestService: CreateHarvestService) {}

  @Post()
  async create(
    @Body() data: CreateHarvestDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const harvest: IHarvest = await this.createHarvestService.execute(data);

    return res.status(HttpStatus.CREATED).json({
      status: true,
      data: harvest,
    });
  }
}

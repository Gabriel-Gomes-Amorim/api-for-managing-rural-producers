import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFarmDTO } from '../dtos/create-farm.dto';
import { IFarm } from '../entities/farm.entity';
import { CreateFarmService } from '../services/create-farm.service';
import { Response } from 'express';

@Controller('farms')
@ApiTags('farms')
export class CreateFarmController {
  constructor(private readonly createFarmService: CreateFarmService) {}

  @Post()
  async create(
    @Body() data: CreateFarmDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const farm: IFarm = await this.createFarmService.execute(data);

    return res.status(HttpStatus.CREATED).json({
      status: true,
      data: farm,
    });
  }
}

import { Body, Controller, HttpStatus, Param, Put, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateFarmService } from '../services/update-farm.service';
import { IFarm } from '../entities/farm.entity';
import { UpdateFarmDTO } from '../dtos/update-farm.dto';
import { Response } from 'express';

@Controller('farms')
@ApiTags('farms')
export class UpdateFarmController {
  constructor(private readonly updateFarmService: UpdateFarmService) {}

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateFarmDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const farm: IFarm = await this.updateFarmService.execute(data, id);

    return res.status(HttpStatus.OK).json({
      status: true,
      data: farm,
    });
  }
}

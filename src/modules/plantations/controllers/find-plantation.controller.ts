import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindPlantationService } from '../services/find-plantation.service';
import { IPlantation } from '../entities/plantation.entity';
import { Response } from 'express';

@Controller('plantations')
@ApiTags('plantations')
export class FindPlantationController {
  constructor(private readonly findPlantationService: FindPlantationService) {}

  @Get(':id')
  async find(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    const plantation: IPlantation =
      await this.findPlantationService.execute(id);

    return res.status(HttpStatus.OK).json({
      status: true,
      data: plantation,
    });
  }
}

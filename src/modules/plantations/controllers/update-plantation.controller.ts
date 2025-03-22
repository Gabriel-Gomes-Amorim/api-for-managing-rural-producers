import { Body, Controller, HttpStatus, Param, Put, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePlantationService } from '../services/update-plantantion.service';
import { IPlantation } from '../entities/plantation.entity';
import { UpdatePlantationDTO } from '../dtos/update-plantation.dto';
import { Response } from 'express';

@Controller('plantations')
@ApiTags('plantations')
export class UpdatePlantationController {
  constructor(
    private readonly updatePlantationService: UpdatePlantationService,
  ) {}

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePlantationDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const plantation: IPlantation = await this.updatePlantationService.execute(
      data,
      id,
    );

    return res.status(HttpStatus.OK).json({
      status: true,
      data: plantation,
    });
  }
}

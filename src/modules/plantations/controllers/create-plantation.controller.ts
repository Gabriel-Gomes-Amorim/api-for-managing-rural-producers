import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePlantationService } from '../services/create-plantation.service';
import { CreatePlantationDTO } from '../dtos/create-plantation.dto';
import { IPlantation } from '../entities/plantation.entity';
import { Response } from 'express';

@Controller('plantations')
@ApiTags('plantations')
export class CreatePlantationController {
  constructor(
    private readonly createPlantationService: CreatePlantationService,
  ) {}

  @Post()
  async create(
    @Body() data: CreatePlantationDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const plantation: IPlantation =
      await this.createPlantationService.execute(data);

    return res.status(HttpStatus.CREATED).json({
      status: true,
      data: plantation,
    });
  }
}

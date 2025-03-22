import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  IListAllPlantationsRequestUseCase,
  ListAllPlantationsService,
} from '../services/list-all-plantations.service';
import { IPlantation } from '../entities/plantation.entity';
import { IListResponseRepository } from '@/core/repositories';
import { Response } from 'express';

@Controller('plantations')
@ApiTags('plantations')
export class ListPlantationsController {
  constructor(
    private readonly listAllPlantationsService: ListAllPlantationsService,
  ) {}

  @Get()
  @ApiQuery({ name: 'name', required: false, description: 'Plantation name' })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of plantations to be returned',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of plantations to skip',
  })
  @HttpCode(HttpStatus.OK)
  async list(
    @Query() query: IListAllPlantationsRequestUseCase,
    @Res() res: Response,
  ): Promise<Response> {
    const { name, take, skip } = query;

    const plantations: IListResponseRepository<IPlantation> =
      await this.listAllPlantationsService.execute({
        name,
        take: take ? Number(take) : undefined,
        skip: skip ? Number(skip) : undefined,
      });

    return res.status(HttpStatus.OK).json({
      status: true,
      data: plantations,
    });
  }
}

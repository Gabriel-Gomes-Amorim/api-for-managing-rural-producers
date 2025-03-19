import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  IListAllPlantationsRequestUseCase,
  ListAllPlantationsService,
} from '../services/list-all-plantations.service';
import { IPlantation } from '../entities/plantation.entity';
import { IListResponseRepository } from '@/core/repositories';

@Controller('plantations')
@ApiTags('plantations')
export class ListPlantationsController {
  constructor(
    private readonly listAllPlantationsService: ListAllPlantationsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Query() query: IListAllPlantationsRequestUseCase) {
    const { name, take, skip } = query;

    const plantations: IListResponseRepository<IPlantation> =
      await this.listAllPlantationsService.execute({
        name,
        take: take ? Number(take) : undefined,
        skip: skip ? Number(skip) : undefined,
      });

    return {
      status: true,
      statusCode: HttpStatus.OK,
      data: plantations,
    };
  }
}

import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  IListAllHarvestsRequestUseCase,
  ListAllHarvestsService,
} from '../services/list-all-harvests.service';
import { IHarvest } from '../entities/harvest.entity';
import { IListResponseRepository } from '@/core/repositories';

@Controller('harvests')
@ApiTags('harvests')
export class ListHarvestsController {
  constructor(
    private readonly listAllHarvestsService: ListAllHarvestsService,
  ) {}

  @Get()
  @ApiQuery({ name: 'year', required: false, description: 'Harvest year' })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of harvests to be returned',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of harvests to skip',
  })
  @HttpCode(HttpStatus.OK)
  async list(@Query() query: IListAllHarvestsRequestUseCase) {
    const { year, take, skip } = query;

    const harvests: IListResponseRepository<IHarvest> =
      await this.listAllHarvestsService.execute({
        year,
        take: take ? Number(take) : undefined,
        skip: skip ? Number(skip) : undefined,
      });

    return {
      status: true,
      statusCode: HttpStatus.OK,
      data: harvests,
    };
  }
}

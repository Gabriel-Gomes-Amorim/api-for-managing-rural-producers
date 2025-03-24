import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  IListAllFarmsRequestUseCase,
  ListAllFarmsService,
} from '../services/list-all-farms.service';
import { IFarm } from '../entities/farm.entity';
import { IListResponseRepository } from '@/core/repositories';
import { Response } from 'express';

@Controller('farms')
@ApiTags('farms')
export class ListFarmsController {
  constructor(private readonly listAllFarmsService: ListAllFarmsService) {}

  @Get()
  @ApiQuery({ name: 'name', required: false, description: 'Farm name' })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of farms to be returned',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of farms to skip',
  })
  async list(
    @Query() query: IListAllFarmsRequestUseCase,
    @Res() res: Response,
  ): Promise<Response> {
    const { name, take, skip } = query;

    const farms: IListResponseRepository<IFarm> =
      await this.listAllFarmsService.execute({
        name,
        take: take ? Number(take) : undefined,
        skip: skip ? Number(skip) : undefined,
      });

    return res.status(HttpStatus.OK).json({
      status: true,
      data: farms,
    });
  }
}

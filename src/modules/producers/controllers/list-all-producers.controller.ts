import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import {
  IListAllProducersRequestUseCase,
  ListAllProducersService,
} from '../services/list-all-producers.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { IProducer } from '../entities/producer.entity';
import { IListResponseRepository } from '@/core/repositories';
import { Response } from 'express';

@Controller('producers')
@ApiTags('producers')
export class ListProducersController {
  constructor(
    private readonly listAllProducersService: ListAllProducersService,
  ) {}

  @Get()
  @ApiQuery({ name: 'name', required: false, description: 'Producer name' })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of producers to be returned',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of producers to skip',
  })
  async list(
    @Query() query: IListAllProducersRequestUseCase,
    @Res() res: Response,
  ): Promise<Response> {
    const { name, take, skip } = query;

    const producers: IListResponseRepository<IProducer> =
      await this.listAllProducersService.execute({
        name,
        take: take ? Number(take) : undefined,
        skip: skip ? Number(skip) : undefined,
      });

    return res.status(HttpStatus.OK).json({
      status: true,
      data: producers,
    });
  }
}

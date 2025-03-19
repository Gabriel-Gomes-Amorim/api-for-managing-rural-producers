import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import {
  IListAllProducersRequestUseCase,
  ListAllProducersService,
} from '../services/list-all-producers.service';
import { ApiTags } from '@nestjs/swagger';
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

import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { FindProducerService } from '../services/find-producer.service';
import { ApiTags } from '@nestjs/swagger';
import { IProducer } from '../entities/producer.entity';
import { Response } from 'express';

@Controller('producers')
@ApiTags('producers')
export class FindProducerController {
  constructor(private readonly findProducerService: FindProducerService) {}

  @Get(':id')
  async find(@Res() res: Response, @Param('id') id: string): Promise<Response> {
    const producer: IProducer = await this.findProducerService.execute(id);

    return res.status(HttpStatus.OK).json({
      status: true,
      data: producer,
    });
  }
}

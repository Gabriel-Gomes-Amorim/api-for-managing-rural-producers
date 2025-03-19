import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateProducerService } from '../services/create-producer.service';
import { CreateProducerDTO } from '../dtos/create-producer.dto';
import { ApiTags } from '@nestjs/swagger';
import { IProducer } from '../entities/producer.entity';
import { Response } from 'express';

@Controller('producers')
@ApiTags('producers')
export class CreateProducerController {
  constructor(private readonly createProducerService: CreateProducerService) {}

  @Post()
  async create(
    @Body() data: CreateProducerDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const producer: IProducer = await this.createProducerService.execute(data);

    return res.status(HttpStatus.CREATED).json({
      status: true,
      data: producer,
    });
  }
}

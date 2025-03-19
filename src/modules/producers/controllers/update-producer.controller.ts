import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Res,
} from '@nestjs/common';
import { UpdateProducerService } from '../services/update-producer.service';
import { UpdateProducerDTO } from '../dtos/update-producer.dto';
import { IProducer } from '../entities/producer.entity';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('producers')
@ApiTags('producers')
export class UpdateProducerController {
  constructor(private readonly updateProducerService: UpdateProducerService) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProducerDTO,
    @Res() res: Response,
  ): Promise<Response> {
    const producer: IProducer = await this.updateProducerService.execute(
      data,
      id,
    );

    return res.status(HttpStatus.OK).json({
      status: true,
      data: producer,
    });
  }
}

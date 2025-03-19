import { Inject, Injectable } from '@nestjs/common';
import { IProducersRepository } from '../repositories/producer-repository.interface';
import { IProducer } from '../entities/producer.entity';
import { AppError } from '@/shared/errors/app-error';

@Injectable()
export class FindProducerService {
  constructor(
    @Inject('IProducersRepository')
    private readonly producersRepository: IProducersRepository,
  ) {}

  async execute(id: string): Promise<IProducer> {
    const producer: IProducer | null = await this.producersRepository.find({
      fields: {
        id,
      },
    });

    if (!producer) {
      throw new AppError('Producer not found', 404, 'PRODUCER_NOT_FOUND');
    }

    return producer;
  }
}

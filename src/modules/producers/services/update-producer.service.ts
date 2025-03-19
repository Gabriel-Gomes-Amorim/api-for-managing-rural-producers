import { Inject, Injectable } from '@nestjs/common';
import { IProducersRepository } from '../repositories/producer-repository.interface';
import { IProducer } from '../entities/producer.entity';
import { AppError } from '@/shared/errors/app-error';

@Injectable()
export class UpdateProducerService {
  constructor(
    @Inject('IProducersRepository')
    private readonly producersRepository: IProducersRepository,
  ) {}

  async execute(data: Partial<IProducer>, id: string): Promise<IProducer> {
    const existingProducer: IProducer | null =
      await this.producersRepository.find({
        fields: {
          id,
        },
      });

    if (!existingProducer) {
      throw new AppError('Producer not found', 404, 'PRODUCER_NOT_FOUND');
    }

    const updatedProducer: IProducer = await this.producersRepository.update(
      {
        name: data.name,
        cpfCnpj: data.cpfCnpj,
      },
      existingProducer.id,
    );

    return updatedProducer;
  }
}

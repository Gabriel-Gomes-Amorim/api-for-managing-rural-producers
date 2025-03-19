import { Inject, Injectable } from '@nestjs/common';
import { IProducersRepository } from '../repositories/producer-repository.interface';
import { IProducer } from '../entities/producer.entity';
import { CreateProducerDTO } from '../dtos/create-producer.dto';
import { AppError } from '@/shared/errors/app-error';

@Injectable()
export class CreateProducerService {
  constructor(
    @Inject('IProducersRepository')
    private readonly producersRepository: IProducersRepository,
  ) {}

  async execute(data: CreateProducerDTO): Promise<IProducer> {
    const producerAlreadyExists: IProducer | null =
      await this.producersRepository.find({
        fields: [
          {
            name: data.name,
          },
          {
            cpfCnpj: data.cpfCnpj,
          },
        ],
        operator: 'OR',
      });

    if (producerAlreadyExists) {
      throw new AppError(
        'Producer already exists',
        409,
        'PRODUCER_ALREADY_EXISTS',
      );
    }

    const producer: IProducer = await this.producersRepository.create({
      name: data.name,
      cpfCnpj: data.cpfCnpj,
    });

    return producer;
  }
}

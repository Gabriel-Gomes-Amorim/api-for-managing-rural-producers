import { Inject, Injectable } from '@nestjs/common';
import { IProducersRepository } from '../infra/db/producers-repository';
import { IProducer } from '../entities/producer.entity';
import { IListResponseRepository } from 'src/core/repositories';

export interface IListAllProducersRequestUseCase {
  name?: string;
  take?: number;
  skip?: number;
}

@Injectable()
export class ListAllProducersService {
  constructor(
    @Inject('IProducersRepository')
    private readonly producersRepository: IProducersRepository,
  ) {}

  async execute({
    name,
    skip,
    take,
  }: IListAllProducersRequestUseCase): Promise<
    IListResponseRepository<IProducer>
  > {
    const producers: IListResponseRepository<IProducer> =
      await this.producersRepository.list({
        fields: { key: 'name', value: name ?? '', findType: 'iLike' },
        skip,
        take,
      });

    return producers;
  }
}

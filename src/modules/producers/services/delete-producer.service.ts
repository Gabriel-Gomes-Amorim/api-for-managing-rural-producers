import { Inject, Injectable } from '@nestjs/common';
import { IProducersRepository } from '../repositories/producer-repository.interface';

@Injectable()
export class DeleteProducerService {
  constructor(
    @Inject('IProducersRepository')
    private readonly producersRepository: IProducersRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.producersRepository.delete(id);
  }
}

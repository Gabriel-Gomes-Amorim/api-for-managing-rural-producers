import { Inject, Injectable } from '@nestjs/common';
import { IProducersRepository } from '../infra/db/producers-repository';

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

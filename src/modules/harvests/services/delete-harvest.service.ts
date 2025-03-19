import { Inject, Injectable } from '@nestjs/common';
import { IHarvestsRepository } from '../repositories/harvest-repository.interface';

@Injectable()
export class DeleteHarvestService {
  constructor(
    @Inject('IHarvestsRepository')
    private readonly harvestsRepository: IHarvestsRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.harvestsRepository.delete(id);
  }
}

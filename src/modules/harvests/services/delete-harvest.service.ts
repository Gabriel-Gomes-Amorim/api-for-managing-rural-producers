import { Inject, Injectable } from '@nestjs/common';
import { IHarvestsRepository } from '../infra/db/harvests-repository';

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

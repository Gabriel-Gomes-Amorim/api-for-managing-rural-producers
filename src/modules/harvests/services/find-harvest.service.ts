import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@/shared/errors/app-error';
import { IHarvestsRepository } from '../repositories/harvest-repository.interface';
import { IHarvest } from '../entities/harvest.entity';

@Injectable()
export class FindHarvestService {
  constructor(
    @Inject('IHarvestsRepository')
    private readonly harvestsRepository: IHarvestsRepository,
  ) {}

  async execute(id: string): Promise<IHarvest> {
    const harvest: IHarvest | null = await this.harvestsRepository.find({
      fields: {
        id,
      },
    });

    if (!harvest) {
      throw new AppError('Harvest not found', 404, 'HARVEST_NOT_FOUND');
    }

    return harvest;
  }
}

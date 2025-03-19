import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@/shared/errors/app-error';
import { IHarvestsRepository } from '../repositories/harvest-repository.interface';
import { IHarvest } from '../entities/harvest.entity';

@Injectable()
export class UpdateHarvestService {
  constructor(
    @Inject('IHarvestsRepository')
    private readonly harvestsRepository: IHarvestsRepository,
  ) {}

  async execute(data: Partial<IHarvest>, id: string): Promise<IHarvest> {
    const existingHarvest: IHarvest | null = await this.harvestsRepository.find(
      {
        fields: {
          id,
        },
      },
    );

    if (!existingHarvest) {
      throw new AppError('Harvest not found', 404, 'HARVEST_NOT_FOUND');
    }

    const updatedHarvest: IHarvest = await this.harvestsRepository.update(
      {
        year: data.year,
        farmId: data.farmId,
      },
      existingHarvest.id,
    );

    return updatedHarvest;
  }
}

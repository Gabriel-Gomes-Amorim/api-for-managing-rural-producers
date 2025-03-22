import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@/shared/errors/app-error';
import { IFarm } from '../entities/farm.entity';
import { IFarmsRepository } from '../infra/db/farms-repository';

@Injectable()
export class UpdateFarmService {
  constructor(
    @Inject('IFarmsRepository')
    private readonly FarmsRepository: IFarmsRepository,
  ) {}

  async execute(data: Partial<IFarm>, id: string): Promise<IFarm> {
    const existingFarm: IFarm | null = await this.FarmsRepository.find({
      fields: {
        id,
      },
    });

    if (!existingFarm) {
      throw new AppError('Farm not found', 404, 'FARM_NOT_FOUND');
    }

    const updatedFarm: IFarm = await this.FarmsRepository.update(
      {
        name: data.name,
        city: data.city,
        state: data.state,
        totalArea: data.totalArea,
        farmableArea: data.farmableArea,
        vegetationArea: data.vegetationArea,
      },
      existingFarm.id,
    );

    return updatedFarm;
  }
}

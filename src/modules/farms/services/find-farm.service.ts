import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@/shared/errors/app-error';
import { IFarm } from '../entities/farm.entity';
import { IFarmsRepository } from '../infra/db/farms-repository';

@Injectable()
export class FindFarmService {
  constructor(
    @Inject('IFarmsRepository')
    private readonly FarmsRepository: IFarmsRepository,
  ) {}

  async execute(id: string): Promise<IFarm> {
    const farm: IFarm | null = await this.FarmsRepository.find({
      fields: {
        id,
      },
    });

    if (!farm) {
      throw new AppError('Farm not found', 404, 'FARM_NOT_FOUND');
    }

    return farm;
  }
}

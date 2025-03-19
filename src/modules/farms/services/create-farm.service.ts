import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@/shared/errors/app-error';
import { IFarmsRepository } from '../repositories/farm-repository.interface';
import { CreateFarmDTO } from '../dtos/create-farm.dto';
import { IFarm } from '../entities/farm.entity';

@Injectable()
export class CreateFarmService {
  constructor(
    @Inject('IFarmsRepository')
    private readonly farmsRepository: IFarmsRepository,
  ) {}

  async execute(data: CreateFarmDTO): Promise<IFarm> {
    const farmAlreadyExists: IFarm | null = await this.farmsRepository.find({
      fields: {
        name: data.name,
        state: data.state,
        city: data.city,
      },
      operator: 'AND',
    });

    if (farmAlreadyExists) {
      throw new AppError('Farm already exists', 409, 'FARM_ALREADY_EXISTS');
    }

    if (data.farmableArea + data.vegetationArea > data.totalArea) {
      throw new AppError(
        'The sum of farmable and vegetation areas cannot exceed the total area',
        400,
        'INVALID_AREA_VALUES',
      );
    }

    const farm: IFarm = await this.farmsRepository.create({
      name: data.name,
      city: data.city,
      state: data.state,
      totalArea: data.totalArea,
      farmableArea: data.farmableArea,
      vegetationArea: data.vegetationArea,
      producerId: data.producerId,
    });

    return farm;
  }
}

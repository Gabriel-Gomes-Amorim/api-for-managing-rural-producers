import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@/shared/errors/app-error';
import { IPlantationsRepository } from '../infra/db/plantations-repository';
import { IPlantation } from '../entities/plantation.entity';

@Injectable()
export class UpdatePlantationService {
  constructor(
    @Inject('IPlantationsRepository')
    private readonly plantationsRepository: IPlantationsRepository,
  ) {}

  async execute(data: Partial<IPlantation>, id: string): Promise<IPlantation> {
    const existingPlantation: IPlantation | null =
      await this.plantationsRepository.find({
        fields: {
          id,
        },
      });

    if (!existingPlantation) {
      throw new AppError('Plantation not found', 404, 'PLANTATION_NOT_FOUND');
    }

    const updatedPlantation: IPlantation =
      await this.plantationsRepository.update(
        {
          name: data.name,
          harvestId: data.harvestId,
        },
        existingPlantation.id,
      );

    return updatedPlantation;
  }
}

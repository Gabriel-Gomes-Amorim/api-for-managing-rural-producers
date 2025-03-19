import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@/shared/errors/app-error';
import { IPlantationsRepository } from '../repositories/plantation-repository.interface';
import { IPlantation } from '../entities/plantation.entity';

@Injectable()
export class FindPlantationService {
  constructor(
    @Inject('IPlantationsRepository')
    private readonly plantationsRepository: IPlantationsRepository,
  ) {}

  async execute(id: string): Promise<IPlantation> {
    const plantation: IPlantation | null =
      await this.plantationsRepository.find({
        fields: {
          id,
        },
      });

    if (!plantation) {
      throw new AppError('Plantation not found', 404, 'PLANTATION_NOT_FOUND');
    }

    return plantation;
  }
}

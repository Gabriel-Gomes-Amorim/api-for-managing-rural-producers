import { Inject, Injectable } from '@nestjs/common';
import { AppError } from '@/shared/errors/app-error';
import { CreatePlantationDTO } from '../dtos/create-plantation.dto';
import { IPlantation } from '../entities/plantation.entity';
import { IPlantationsRepository } from '../infra/db/plantations-repository';

@Injectable()
export class CreatePlantationService {
  constructor(
    @Inject('IPlantationsRepository')
    private readonly plantationsRepository: IPlantationsRepository,
  ) {}

  async execute(data: CreatePlantationDTO): Promise<IPlantation> {
    const plantationAlreadyExists: IPlantation | null =
      await this.plantationsRepository.find({
        fields: {
          name: data.name,
        },
      });

    if (plantationAlreadyExists) {
      throw new AppError(
        'Plantation already exists',
        409,
        'PLANTATION_ALREADY_EXISTS',
      );
    }

    const plantation: IPlantation = await this.plantationsRepository.create({
      name: data.name,
      harvestId: data.harvestId,
    });

    return plantation;
  }
}

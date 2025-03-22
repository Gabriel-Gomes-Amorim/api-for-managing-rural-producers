import { Inject, Injectable } from '@nestjs/common';
import { CreateHarvestDTO } from '../dtos/create-harvest.dto';
import { IHarvest } from '../entities/harvest.entity';
import { IHarvestsRepository } from '../infra/db/harvests-repository';

@Injectable()
export class CreateHarvestService {
  constructor(
    @Inject('IHarvestsRepository')
    private readonly harvestsRepository: IHarvestsRepository,
  ) {}

  async execute(data: CreateHarvestDTO): Promise<IHarvest> {
    return await this.harvestsRepository.create({
      year: data.year,
      farmId: data.farmId,
    });
  }
}

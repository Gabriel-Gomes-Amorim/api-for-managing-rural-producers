import { Inject, Injectable } from '@nestjs/common';
import { IListResponseRepository } from 'src/core/repositories';
import { IHarvestsRepository } from '../infra/db/harvests-repository';
import { IHarvest } from '../entities/harvest.entity';

export interface IListAllHarvestsRequestUseCase {
  year?: number;
  take?: number;
  skip?: number;
}

@Injectable()
export class ListAllHarvestsService {
  constructor(
    @Inject('IHarvestsRepository')
    private readonly harvestsRepository: IHarvestsRepository,
  ) {}

  async execute({
    year,
    skip,
    take,
  }: IListAllHarvestsRequestUseCase): Promise<
    IListResponseRepository<IHarvest>
  > {
    const harvests = await this.harvestsRepository.list({
      fields: { key: 'year', value: year ?? 0, findType: 'iLike' },
      skip,
      take,
    });

    return harvests;
  }
}

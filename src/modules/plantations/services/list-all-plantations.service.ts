import { Inject, Injectable } from '@nestjs/common';
import { IListResponseRepository } from 'src/core/repositories';
import { IPlantationsRepository } from '../repositories/plantation-repository.interface';
import { IPlantation } from '../entities/plantation.entity';

export interface IListAllPlantationsRequestUseCase {
  name?: string;
  take?: number;
  skip?: number;
}

@Injectable()
export class ListAllPlantationsService {
  constructor(
    @Inject('IPlantationsRepository')
    private readonly plantationsRepository: IPlantationsRepository,
  ) {}

  async execute({
    name,
    skip,
    take,
  }: IListAllPlantationsRequestUseCase): Promise<
    IListResponseRepository<IPlantation>
  > {
    const plantations = await this.plantationsRepository.list({
      fields: { key: 'name', value: name ?? '', findType: 'iLike' },
      skip,
      take,
    });

    return plantations;
  }
}

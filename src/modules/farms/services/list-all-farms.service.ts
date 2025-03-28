import { Inject, Injectable } from '@nestjs/common';
import { IListResponseRepository } from 'src/core/repositories';
import { IFarm } from '../entities/farm.entity';
import { IFarmsRepository } from '../infra/db/farms-repository';

export interface IListAllFarmsRequestUseCase {
  name?: string;
  take?: number;
  skip?: number;
}

@Injectable()
export class ListAllFarmsService {
  constructor(
    @Inject('IFarmsRepository')
    private readonly FarmsRepository: IFarmsRepository,
  ) {}

  async execute({
    name,
    skip,
    take,
  }: IListAllFarmsRequestUseCase): Promise<IListResponseRepository<IFarm>> {
    const farms: IListResponseRepository<IFarm> =
      await this.FarmsRepository.list({
        fields: { key: 'name', value: name ?? '', findType: 'iLike' },
        skip,
        take,
      });

    return farms;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { IFarmsRepository } from '../repositories/farm-repository.interface';

@Injectable()
export class DeleteFarmService {
  constructor(
    @Inject('IFarmsRepository')
    private readonly farmsRepository: IFarmsRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.farmsRepository.delete(id);
  }
}

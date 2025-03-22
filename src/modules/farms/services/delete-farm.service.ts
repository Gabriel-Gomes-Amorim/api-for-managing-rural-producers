import { Inject, Injectable } from '@nestjs/common';
import { IFarmsRepository } from '../infra/db/farms-repository';

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

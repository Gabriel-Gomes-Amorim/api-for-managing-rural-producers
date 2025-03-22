import { Inject, Injectable } from '@nestjs/common';
import { IPlantationsRepository } from '../infra/db/plantations-repository';

@Injectable()
export class DeletePlantationService {
  constructor(
    @Inject('IPlantationsRepository')
    private readonly plantationsRepository: IPlantationsRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.plantationsRepository.delete(id);
  }
}

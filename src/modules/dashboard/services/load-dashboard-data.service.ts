import { IGetFarmDashboardData } from '@/modules/farms/interfaces/IGetFarmDashboardData';
import { IFarmsRepository } from '@/modules/farms/repositories/farm-repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class LoadDashboardDataService {
  constructor(
    @Inject('IFarmsRepository')
    private readonly farmsRepository: IFarmsRepository,
  ) {}

  async execute(): Promise<IGetFarmDashboardData> {
    const dashboardData: IGetFarmDashboardData =
      await this.farmsRepository.getDashboardData();

    return {
      totalFarms: dashboardData.totalFarms,
      totalHectares: dashboardData.totalHectares,
      farmsByStateData: dashboardData.farmsByStateData.map((item) => ({
        state: item.state,
        count: item.count,
      })),
    };
  }
}

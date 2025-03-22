import { IFarmsRepository } from '@/modules/farms/infra/db/farms-repository';
import { IGetFarmDashboardData } from '@/modules/farms/interfaces/IGetFarmDashboardData';
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
      plantationsData: dashboardData.plantationsData.map((item) => ({
        name: item.name,
        count: item.count,
      })),
      landUsage: {
        farmableArea: dashboardData.landUsage.farmableArea,
        vegetationArea: dashboardData.landUsage.vegetationArea,
      },
    };
  }
}

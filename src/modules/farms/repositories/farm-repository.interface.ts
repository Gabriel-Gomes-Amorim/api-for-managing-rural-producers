import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from 'src/core/repositories';
import { IFarm } from '../entities/farm.entity';
import { IGetFarmDashboardData } from '../interfaces/IGetFarmDashboardData';

export interface IFarmsRepository {
  create(data: Omit<IFarm, 'id' | 'createdAt' | 'updatedAt'>): Promise<IFarm>;
  find({
    fields,
    operator,
  }: IFindRequestRepository<IFarm>): Promise<IFarm | null>;
  list(
    data: IListRequestRepository<IFarm>,
  ): Promise<IListResponseRepository<IFarm>>;
  update(data: WhereParams<IFarm>, id: string): Promise<IFarm>;
  delete(id: string): Promise<void>;
  getDashboardData(): Promise<IGetFarmDashboardData>;
}

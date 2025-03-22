import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from 'src/core/repositories';
import { IHarvest } from '../../entities/harvest.entity';

export interface IHarvestsRepository {
  create(
    data: Omit<IHarvest, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IHarvest>;
  find({
    fields,
    operator,
  }: IFindRequestRepository<IHarvest>): Promise<IHarvest | null>;
  list(
    data: IListRequestRepository<IHarvest>,
  ): Promise<IListResponseRepository<IHarvest>>;
  update(data: WhereParams<IHarvest>, id: string): Promise<IHarvest>;
  delete(id: string): Promise<void>;
}

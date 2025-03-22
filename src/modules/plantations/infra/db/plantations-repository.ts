import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from 'src/core/repositories';
import { IPlantation } from '../entities/plantation.entity';

export interface IPlantationsRepository {
  create(
    data: Omit<IPlantation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IPlantation>;
  find({
    fields,
    operator,
  }: IFindRequestRepository<IPlantation>): Promise<IPlantation | null>;
  list(
    data: IListRequestRepository<IPlantation>,
  ): Promise<IListResponseRepository<IPlantation>>;
  update(data: WhereParams<IPlantation>, id: string): Promise<IPlantation>;
  delete(id: string): Promise<void>;
}

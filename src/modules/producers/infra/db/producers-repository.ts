import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from 'src/core/repositories';
import { IProducer } from '../../entities/producer.entity';

export interface IProducersRepository {
  create(
    data: Omit<IProducer, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IProducer>;
  find({
    fields,
    operator,
  }: IFindRequestRepository<IProducer>): Promise<IProducer | null>;
  list(
    data: IListRequestRepository<IProducer>,
  ): Promise<IListResponseRepository<IProducer>>;
  update(data: WhereParams<IProducer>, id: string): Promise<IProducer>;
  delete(id: string): Promise<void>;
}

import { WhereParams } from './IFindRepository';

export interface IUpdateRepository<T> {
  update(
    data: WhereParams<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
    id: string,
  ): Promise<T>;
}

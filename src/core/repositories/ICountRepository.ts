import { typeOperator, WhereParams } from '.';

export interface ICountRequestRepository<T> {
  fields: WhereParams<T> | WhereParams<T>[];
  operator?: typeOperator;
}

export interface ICountRepository<T> {
  count(data: ICountRequestRepository<T>): Promise<number>;
}

import { typeOperator } from './IFindRepository';

export type TField<T> = {
  [K in keyof T]: {
    key: K;
    value: T[K];
    findType?: 'iLike' | 'like' | 'equal';
  };
}[keyof T];

export interface IResolveWhereToList<T> {
  operator?: typeOperator;
  fields?: TField<T> | TField<T>[];
  startDate?: Date;
  endDate?: Date;
}

export interface IListRequestRepository<T> {
  operator?: typeOperator;
  fields?: TField<T> | TField<T>[];
  take?: number;
  skip?: number;
  orderBy?: Array<OrderByType<T>> | OrderByType<T>;
  startDate?: Date;
  endDate?: Date;
}

type Primitive = string | number | boolean | Date;

export type OrderByType<T> = {
  [K in keyof T]?: T[K] extends Primitive
    ? 'asc' | 'desc'
    : T[K] extends Array<infer U>
      ? OrderByType<U>
      : T[K] extends object
        ? OrderByType<T[K]>
        : never;
};

export interface IListResponseRepository<T> {
  take: number;
  skip: number;
  count: number;
  data: T[];
}

export interface IListRepository<T> {
  list(
    data: IListRequestRepository<T>,
    isAdmin?: boolean,
  ): Promise<IListResponseRepository<T>>;
}

type Query<T, K extends keyof T> = T[K] | Array<T[K]>;

export type WhereParams<T> = {
  [K in keyof T]?: T[K] | Query<T, K>;
};

export type typeOperator = 'AND' | 'OR' | 'NOT';

export interface IFindRequestRepository<T> {
  fields: WhereParams<T> | WhereParams<T>[];
  operator?: typeOperator;
}

export interface IFindRepository<T> {
  find(data: IFindRequestRepository<T>): Promise<T | null>;
}

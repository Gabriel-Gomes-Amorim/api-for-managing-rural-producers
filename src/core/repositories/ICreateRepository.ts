export interface ICreateRepository<T, R> {
  create(data: T): Promise<R>;
}

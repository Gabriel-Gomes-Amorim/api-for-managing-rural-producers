import { randomUUID } from 'crypto';
import { IProducer } from '../../entities/producer.entity';
import { IProducersRepository } from '../../repositories/producer-repository.interface';
import { PrismaProducerMapper } from '../../infra/db/prisma/mapper/prisma-producer-mapper';
import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from '@/core/repositories';

export class InMemoryProducerRepository implements IProducersRepository {
  public producers: IProducer[] = [];
  mapper = new PrismaProducerMapper();

  async create(
    data: Omit<IProducer, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IProducer> {
    const producer: IProducer = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.producers.push(producer);

    return producer;
  }

  async find({
    fields,
    operator = 'AND',
  }: IFindRequestRepository<IProducer>): Promise<IProducer | null> {
    let where: Record<string, any>[] = [];

    if (Array.isArray(fields)) {
      where = fields.map((field) => {
        const key = Object.keys(field)[0];
        return { key, value: field[key as keyof IProducer] };
      });
    } else if (fields) {
      const key = Object.keys(fields)[0];
      where.push({ key, value: fields[key as keyof IProducer] });
    }

    return (
      this.producers.find((producer) => {
        if (operator === 'AND') {
          return where.every(({ key, value }) =>
            Array.isArray(value)
              ? value.includes(producer[key as keyof IProducer])
              : producer[key as keyof IProducer] === value,
          );
        } else if (operator === 'OR') {
          return where.some(({ key, value }) =>
            Array.isArray(value)
              ? value.includes(producer[key as keyof IProducer])
              : producer[key as keyof IProducer] === value,
          );
        } else if (operator === 'NOT') {
          return where.every(({ key, value }) =>
            Array.isArray(value)
              ? !value.includes(producer[key as keyof IProducer])
              : producer[key as keyof IProducer] !== value,
          );
        }
        return false;
      }) || null
    );
  }

  async list(
    data: IListRequestRepository<IProducer>,
  ): Promise<IListResponseRepository<IProducer>> {
    const { skip = 0, take = 10, orderBy } = data;
    const where = this.mapper.resolveWhereToList(data);

    const filteredProducers = this.producers.filter((producer) =>
      Object.entries(where).every(([key, value]) => producer[key] === value),
    );

    const sortedProducers = orderBy
      ? filteredProducers.sort((a, b) => {
          const field = Object.keys(orderBy)[0];
          const order = orderBy[field] === 'asc' ? 1 : -1;
          return a[field] > b[field] ? order : -order;
        })
      : filteredProducers;

    const paginatedProducers = sortedProducers.slice(skip, skip + take);

    return {
      skip,
      take,
      count: filteredProducers.length,
      data: paginatedProducers,
    };
  }

  async update(data: WhereParams<IProducer>, id: string): Promise<IProducer> {
    const index = this.producers.findIndex((producer) => producer.id === id);

    if (index === -1) {
      throw new Error('Producer not found');
    }

    this.producers[index] = {
      ...this.producers[index],
      ...data,
      updatedAt: new Date(),
    } as IProducer;

    return this.producers[index];
  }

  async delete(id: string): Promise<void> {
    this.producers = this.producers.filter((producer) => producer.id !== id);
  }
}

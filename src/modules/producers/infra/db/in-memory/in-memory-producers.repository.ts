import { randomUUID } from 'crypto';
import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from '@/core/repositories';
import { IProducer } from '@/modules/producers/entities/producer.entity';
import { IProducersRepository } from '../producers-repository';
import { PrismaProducersMapper } from '../prisma/mapper/prisma-producers.mapper';

export class InMemoryProducersRepository implements IProducersRepository {
  public producers: IProducer[] = [];
  mapper = new PrismaProducersMapper();

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
    const skip = data.skip || 0;
    const take = data.take || 10;

    const where = this.mapper.resolveWhereToList(data) || {};

    const name = where.name as
      | { startsWith?: string; mode?: string }
      | undefined;

    const startsWithValue = name?.startsWith?.replace(/%/g, '') || '';
    const isInsensitive = name?.mode === 'insensitive';

    const filteredProducers = this.producers.filter((producer) => {
      let producerName = producer.name;

      if (isInsensitive) {
        producerName = producerName.toLowerCase();
      }

      return producerName.startsWith(
        isInsensitive ? startsWithValue.toLowerCase() : startsWithValue,
      );
    });

    return {
      skip,
      take,
      count: filteredProducers.length,
      data: filteredProducers.slice(skip, skip + take),
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

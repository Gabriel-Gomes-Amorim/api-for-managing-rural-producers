import { randomUUID } from 'crypto';
import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from '@/core/repositories';
import { IHarvestsRepository } from '../../repositories/harvest-repository.interface';
import { IHarvest } from '../../entities/harvest.entity';
import { PrismaHarvestMapper } from '../../infra/db/prisma/mapper/prisma-harvest-mapper';

export class InMemoryHarvestRepository implements IHarvestsRepository {
  public harvests: IHarvest[] = [];
  mapper = new PrismaHarvestMapper();

  async create(
    data: Omit<IHarvest, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IHarvest> {
    const harvest: IHarvest = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.harvests.push(harvest);

    return harvest;
  }

  async find({
    fields,
    operator = 'AND',
  }: IFindRequestRepository<IHarvest>): Promise<IHarvest | null> {
    let where: Record<string, any>[] = [];

    if (Array.isArray(fields)) {
      where = fields.map((field) => {
        const key = Object.keys(field)[0];
        return { key, value: field[key as keyof IHarvest] };
      });
    } else if (fields) {
      const key = Object.keys(fields)[0];
      where.push({ key, value: fields[key as keyof IHarvest] });
    }

    return (
      this.harvests.find((harvest) => {
        if (operator === 'AND') {
          return where.every(({ key, value }) =>
            Array.isArray(value)
              ? value.includes(harvest[key as keyof IHarvest])
              : harvest[key as keyof IHarvest] === value,
          );
        } else if (operator === 'OR') {
          return where.some(({ key, value }) =>
            Array.isArray(value)
              ? value.includes(harvest[key as keyof IHarvest])
              : harvest[key as keyof IHarvest] === value,
          );
        } else if (operator === 'NOT') {
          return where.every(({ key, value }) =>
            Array.isArray(value)
              ? !value.includes(harvest[key as keyof IHarvest])
              : harvest[key as keyof IHarvest] !== value,
          );
        }
        return false;
      }) || null
    );
  }

  async list(
    data: IListRequestRepository<IHarvest>,
  ): Promise<IListResponseRepository<IHarvest>> {
    const { skip = 0, take = 10, orderBy } = data;
    const where = this.mapper.resolveWhereToList(data);

    const filteredHarvests = this.harvests.filter((harvest) =>
      Object.entries(where).every(([key, value]) => harvest[key] === value),
    );

    const sortedHarvests = orderBy
      ? filteredHarvests.sort((a, b) => {
          const field = Object.keys(orderBy)[0];
          const order = orderBy[field] === 'asc' ? 1 : -1;
          return a[field] > b[field] ? order : -order;
        })
      : filteredHarvests;

    const paginatedHarvests = sortedHarvests.slice(skip, skip + take);

    return {
      skip,
      take,
      count: filteredHarvests.length,
      data: paginatedHarvests,
    };
  }

  async update(data: WhereParams<IHarvest>, id: string): Promise<IHarvest> {
    const index = this.harvests.findIndex((harvest) => harvest.id === id);

    if (index === -1) {
      throw new Error('Harvest not found');
    }

    this.harvests[index] = {
      ...this.harvests[index],
      ...Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
      ),
      updatedAt: new Date(),
    };

    return this.harvests[index];
  }

  async delete(id: string): Promise<void> {
    this.harvests = this.harvests.filter((Harvest) => Harvest.id !== id);
  }
}

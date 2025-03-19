import { randomUUID } from 'crypto';
import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from '@/core/repositories';
import { IFarmsRepository } from '../../repositories/farm-repository.interface';
import { IFarm } from '../../entities/farm.entity';
import { PrismaFarmMapper } from '../../infra/db/prisma/mapper/prisma-farm-mapper';

export class InMemoryFarmRepository implements IFarmsRepository {
  public farms: IFarm[] = [];
  mapper = new PrismaFarmMapper();

  async create(
    data: Omit<IFarm, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IFarm> {
    const farm: IFarm = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.farms.push(farm);

    return farm;
  }

  async find({
    fields,
    operator = 'AND',
  }: IFindRequestRepository<IFarm>): Promise<IFarm | null> {
    let where: Record<string, any>[] = [];

    if (Array.isArray(fields)) {
      where = fields.map((field) => {
        const key = Object.keys(field)[0];
        return { key, value: field[key as keyof IFarm] };
      });
    } else if (fields) {
      const key = Object.keys(fields)[0];
      where.push({ key, value: fields[key as keyof IFarm] });
    }

    return (
      this.farms.find((farm) => {
        if (operator === 'AND') {
          return where.every(({ key, value }) =>
            Array.isArray(value)
              ? value.includes(farm[key as keyof IFarm])
              : farm[key as keyof IFarm] === value,
          );
        } else if (operator === 'OR') {
          return where.some(({ key, value }) =>
            Array.isArray(value)
              ? value.includes(farm[key as keyof IFarm])
              : farm[key as keyof IFarm] === value,
          );
        } else if (operator === 'NOT') {
          return where.every(({ key, value }) =>
            Array.isArray(value)
              ? !value.includes(farm[key as keyof IFarm])
              : farm[key as keyof IFarm] !== value,
          );
        }
        return false;
      }) || null
    );
  }

  async list(
    data: IListRequestRepository<IFarm>,
  ): Promise<IListResponseRepository<IFarm>> {
    const { skip = 0, take = 10, orderBy } = data;
    const where = this.mapper.resolveWhereToList(data);

    const filteredFarms = this.farms.filter((farm) =>
      Object.entries(where).every(([key, value]) => farm[key] === value),
    );

    const sortedFarms = orderBy
      ? filteredFarms.sort((a, b) => {
          const field = Object.keys(orderBy)[0];
          const order = orderBy[field] === 'asc' ? 1 : -1;
          return a[field] > b[field] ? order : -order;
        })
      : filteredFarms;

    const paginatedFarms = sortedFarms.slice(skip, skip + take);

    return {
      skip,
      take,
      count: filteredFarms.length,
      data: paginatedFarms,
    };
  }

  async update(data: WhereParams<IFarm>, id: string): Promise<IFarm> {
    const index = this.farms.findIndex((farm) => farm.id === id);

    if (index === -1) {
      throw new Error('Farm not found');
    }

    this.farms[index] = {
      ...this.farms[index],
      ...Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
      ),
      updatedAt: new Date(),
    };

    return this.farms[index];
  }

  async delete(id: string): Promise<void> {
    this.farms = this.farms.filter((farm) => farm.id !== id);
  }
}

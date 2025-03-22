import { randomUUID } from 'crypto';
import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from '@/core/repositories';
import { IHarvestsRepository } from '../harvests-repository';
import { PrismaHarvestsMapper } from '../prisma/mapper/prisma-harvests.mapper';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';

export class InMemoryHarvestsRepository implements IHarvestsRepository {
  public harvests: IHarvest[] = [];
  mapper = new PrismaHarvestsMapper();

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
    const skip = data.skip || 0;
    const take = data.take || 10;

    const where = this.mapper.resolveWhereToList(data) || {};

    const yearFilter = where.year as { startsWith?: string } | undefined;

    const startsWithValue = yearFilter?.startsWith?.replace(/%/g, '') || '';

    const filteredHarvests = this.harvests.filter((harvest) => {
      const harvestYear = String(harvest.year);

      return harvestYear.startsWith(startsWithValue);
    });

    return {
      skip,
      take,
      count: filteredHarvests.length,
      data: filteredHarvests.slice(skip, skip + take),
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

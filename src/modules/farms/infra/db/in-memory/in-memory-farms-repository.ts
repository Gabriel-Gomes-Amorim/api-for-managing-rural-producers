import { randomUUID } from 'crypto';
import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from '@/core/repositories';
import { IFarm } from '../../../entities/farm.entity';
import { IGetFarmDashboardData } from '../../../interfaces/IGetFarmDashboardData';
import { IFarmsRepository } from '../farms-repository';
import { PrismaFarmsMapper } from '../prisma/mapper/prisma-farms.mapper';

export class InMemoryFarmsRepository implements IFarmsRepository {
  public farms: IFarm[] = [];
  mapper = new PrismaFarmsMapper();

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
    const skip = data.skip || 0;
    const take = data.take || 10;

    const where = this.mapper.resolveWhereToList(data) || {};

    const name = where.name as
      | { startsWith?: string; mode?: string }
      | undefined;

    const startsWithValue = name?.startsWith?.replace(/%/g, '') || '';
    const isInsensitive = name?.mode === 'insensitive';

    const filteredFarms = this.farms.filter((farm) => {
      let farmName = farm.name;

      if (isInsensitive) {
        farmName = farmName.toLowerCase();
      }

      return farmName.startsWith(
        isInsensitive ? startsWithValue.toLowerCase() : startsWithValue,
      );
    });

    return {
      skip,
      take,
      count: filteredFarms.length,
      data: filteredFarms.slice(skip, skip + take),
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

  async getDashboardData(): Promise<IGetFarmDashboardData> {
    const totalFarms: number = this.farms.length;

    const totalHectares = this.farms.reduce(
      (sum, farm) => sum + (farm.totalArea || 0),
      0,
    );

    const farmsByState = this.farms.reduce(
      (acc, farm) => {
        const state = farm.state;
        acc[state] = (acc[state] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const landUsage = this.farms.reduce(
      (acc, farm) => {
        acc.farmableArea += farm.farmableArea || 0;
        acc.vegetationArea += farm.vegetationArea || 0;
        return acc;
      },
      { farmableArea: 0, vegetationArea: 0 },
    );

    return {
      totalFarms,
      totalHectares,
      farmsByStateData: Object.entries(farmsByState).map(([state, count]) => ({
        state,
        count,
      })),
      plantationsData: [{ name: 'Soy', count: 2 }],
      landUsage,
    };
  }
}

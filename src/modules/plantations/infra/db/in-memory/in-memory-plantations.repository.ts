import { randomUUID } from 'crypto';
import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from '@/core/repositories';
import { IPlantation } from '../../../entities/plantation.entity';
import { PrismaPlantationsMapper } from '../prisma/mapper/prisma-plantations.mapper';
import { IPlantationsRepository } from '../plantations-repository';

export class InMemoryPlantationsRepository implements IPlantationsRepository {
  public plantations: IPlantation[] = [];
  mapper = new PrismaPlantationsMapper();

  async create(
    data: Omit<IPlantation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IPlantation> {
    const plantation: IPlantation = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.plantations.push(plantation);

    return plantation;
  }

  async find({
    fields,
    operator = 'AND',
  }: IFindRequestRepository<IPlantation>): Promise<IPlantation | null> {
    let where: Record<string, any>[] = [];

    if (Array.isArray(fields)) {
      where = fields.map((field) => {
        const key = Object.keys(field)[0];
        return { key, value: field[key as keyof IPlantation] };
      });
    } else if (fields) {
      const key = Object.keys(fields)[0];
      where.push({ key, value: fields[key as keyof IPlantation] });
    }

    return (
      this.plantations.find((plantation) => {
        if (operator === 'AND') {
          return where.every(({ key, value }) =>
            Array.isArray(value)
              ? value.includes(plantation[key as keyof IPlantation])
              : plantation[key as keyof IPlantation] === value,
          );
        } else if (operator === 'OR') {
          return where.some(({ key, value }) =>
            Array.isArray(value)
              ? value.includes(plantation[key as keyof IPlantation])
              : plantation[key as keyof IPlantation] === value,
          );
        } else if (operator === 'NOT') {
          return where.every(({ key, value }) =>
            Array.isArray(value)
              ? !value.includes(plantation[key as keyof IPlantation])
              : plantation[key as keyof IPlantation] !== value,
          );
        }
        return false;
      }) || null
    );
  }

  async list(
    data: IListRequestRepository<IPlantation>,
  ): Promise<IListResponseRepository<IPlantation>> {
    const skip = data.skip || 0;
    const take = data.take || 10;

    const where = this.mapper.resolveWhereToList(data) || {};

    const name = where.name as
      | { startsWith?: string; mode?: string }
      | undefined;

    const startsWithValue = name?.startsWith?.replace(/%/g, '') || '';
    const isInsensitive = name?.mode === 'insensitive';

    const filteredPlantations = this.plantations.filter((plantation) => {
      let plantationName = plantation.name;

      if (isInsensitive) {
        plantationName = plantationName.toLowerCase();
      }

      return plantationName.startsWith(
        isInsensitive ? startsWithValue.toLowerCase() : startsWithValue,
      );
    });

    return {
      skip,
      take,
      count: filteredPlantations.length,
      data: filteredPlantations.slice(skip, skip + take),
    };
  }

  async update(
    data: WhereParams<IPlantation>,
    id: string,
  ): Promise<IPlantation> {
    const index = this.plantations.findIndex(
      (plantation) => plantation.id === id,
    );

    if (index === -1) {
      throw new Error('Plantation not found');
    }

    this.plantations[index] = {
      ...this.plantations[index],
      ...Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
      ),
      updatedAt: new Date(),
    };

    return this.plantations[index];
  }

  async delete(id: string): Promise<void> {
    this.plantations = this.plantations.filter(
      (Plantation) => Plantation.id !== id,
    );
  }
}

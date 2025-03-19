import { randomUUID } from 'crypto';
import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from '@/core/repositories';
import { IPlantationsRepository } from '../../repositories/plantation-repository.interface';
import { IPlantation } from '../../entities/plantation.entity';
import { PrismaPlantationMapper } from '../../infra/db/prisma/mapper/prisma-plantation-mapper';

export class InMemoryPlantationRepository implements IPlantationsRepository {
  public plantations: IPlantation[] = [];
  mapper = new PrismaPlantationMapper();

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
    const { skip = 0, take = 10, orderBy } = data;
    const where = this.mapper.resolveWhereToList(data);

    const filteredPlantations = this.plantations.filter((plantation) =>
      Object.entries(where).every(([key, value]) => plantation[key] === value),
    );

    const sortedPlantations = orderBy
      ? filteredPlantations.sort((a, b) => {
          const field = Object.keys(orderBy)[0];
          const order = orderBy[field] === 'asc' ? 1 : -1;
          return a[field] > b[field] ? order : -order;
        })
      : filteredPlantations;

    const paginatedPlantations = sortedPlantations.slice(skip, skip + take);

    return {
      skip,
      take,
      count: filteredPlantations.length,
      data: paginatedPlantations,
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

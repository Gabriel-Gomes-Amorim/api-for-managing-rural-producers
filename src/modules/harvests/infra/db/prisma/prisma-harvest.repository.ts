import { Prisma } from '@prisma/client';
import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from 'src/core/repositories';
import { PrismaService } from 'src/shared/infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaHarvestMapper } from './mapper/prisma-harvest-mapper';
import { IHarvestsRepository } from '@/modules/harvests/repositories/harvest-repository.interface';
import { IHarvest } from '@/modules/harvests/entities/harvest.entity';

@Injectable()
export class PrismaHarvestRepository implements IHarvestsRepository {
  constructor(private readonly prisma: PrismaService) {}
  mapper = new PrismaHarvestMapper();

  async create(
    data: Omit<IHarvest, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IHarvest> {
    const harvest = await this.prisma.harvest.create({
      data,
    });

    return harvest;
  }

  async find({
    fields,
    operator,
  }: IFindRequestRepository<IHarvest>): Promise<IHarvest | null> {
    let where: Prisma.HarvestWhereInput | Prisma.HarvestWhereUniqueInput = {};

    if (operator && Array.isArray(fields)) {
      where = {
        [operator]: fields.map((field) => field as Prisma.HarvestWhereInput),
      };
    } else if (fields) {
      where = fields as Prisma.HarvestWhereInput;
    }

    const harvest = await this.prisma.harvest.findFirst({
      where,
    });

    return harvest;
  }

  async list(
    data: IListRequestRepository<IHarvest>,
  ): Promise<IListResponseRepository<IHarvest>> {
    const skip = data.skip || 0;
    const take = data.take || 10;

    const where = this.mapper.resolveWhereToList(data);

    const count = await this.prisma.harvest.count({ where });

    const harvests = await this.prisma.harvest.findMany({
      skip,
      take,
      where,
      orderBy: data.orderBy,
    });

    return {
      skip,
      take,
      count,
      data: harvests,
    };
  }

  async update(data: WhereParams<IHarvest>, id: string): Promise<IHarvest> {
    const dataParsed = data as Prisma.HarvestUpdateInput;

    return this.prisma.harvest.update({
      data: dataParsed,
      where: { id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.harvest.delete({
      where: {
        id,
      },
    });
  }
}

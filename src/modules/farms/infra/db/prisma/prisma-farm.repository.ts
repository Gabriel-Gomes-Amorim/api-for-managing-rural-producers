import { Prisma } from '@prisma/client';
import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from 'src/core/repositories';
import { PrismaService } from 'src/shared/infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaFarmMapper } from './mapper/prisma-farm-mapper';
import { IFarmsRepository } from '@/modules/farms/repositories/farm-repository.interface';
import { IFarm } from '@/modules/farms/entities/farm.entity';

@Injectable()
export class PrismaFarmRepository implements IFarmsRepository {
  constructor(private readonly prisma: PrismaService) {}
  mapper = new PrismaFarmMapper();

  async create(
    data: Omit<IFarm, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IFarm> {
    const farm = await this.prisma.farm.create({
      data,
    });

    return farm;
  }

  async find({
    fields,
    operator,
  }: IFindRequestRepository<IFarm>): Promise<IFarm | null> {
    let where: Prisma.FarmWhereInput | Prisma.FarmWhereUniqueInput = {};

    if (operator && Array.isArray(fields)) {
      where = {
        [operator]: fields.map((field) => field as Prisma.FarmWhereInput),
      };
    } else if (fields) {
      where = fields as Prisma.FarmWhereInput;
    }

    const farm = await this.prisma.farm.findFirst({
      where,
    });

    return farm;
  }

  async list(
    data: IListRequestRepository<IFarm>,
  ): Promise<IListResponseRepository<IFarm>> {
    const skip = data.skip || 0;
    const take = data.take || 10;

    const where = this.mapper.resolveWhereToList(data);

    const count = await this.prisma.farm.count({ where });

    const farms = await this.prisma.farm.findMany({
      skip,
      take,
      where,
      orderBy: data.orderBy,
      include: {
        harvests: true,
      },
    });

    return {
      skip,
      take,
      count,
      data: farms,
    };
  }

  async update(data: WhereParams<IFarm>, id: string): Promise<IFarm> {
    const dataParsed = data as Prisma.FarmUpdateInput;

    return this.prisma.farm.update({
      data: dataParsed,
      where: { id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.farm.delete({
      where: {
        id,
      },
    });
  }
}

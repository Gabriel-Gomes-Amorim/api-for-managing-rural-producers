import { Prisma } from '@prisma/client';
import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from 'src/core/repositories';
import { PrismaService } from 'src/shared/infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IPlantationsRepository } from '@/modules/plantations/repositories/plantation-repository.interface';
import { PrismaPlantationMapper } from './mapper/prisma-plantation-mapper';
import { IPlantation } from '@/modules/plantations/entities/plantation.entity';

@Injectable()
export class PrismaPlantationRepository implements IPlantationsRepository {
  constructor(private readonly prisma: PrismaService) {}
  mapper = new PrismaPlantationMapper();

  async create(
    data: Omit<IPlantation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IPlantation> {
    const plantation = await this.prisma.plantation.create({
      data,
    });

    return plantation;
  }

  async find({
    fields,
    operator,
  }: IFindRequestRepository<IPlantation>): Promise<IPlantation | null> {
    let where: Prisma.PlantationWhereInput | Prisma.PlantationWhereUniqueInput =
      {};

    if (operator && Array.isArray(fields)) {
      where = {
        [operator]: fields.map((field) => field as Prisma.PlantationWhereInput),
      };
    } else if (fields) {
      where = fields as Prisma.PlantationWhereInput;
    }

    const plantation = await this.prisma.plantation.findFirst({
      where,
    });

    return plantation;
  }

  async list(
    data: IListRequestRepository<IPlantation>,
  ): Promise<IListResponseRepository<IPlantation>> {
    const skip = data.skip || 0;
    const take = data.take || 10;

    const where = this.mapper.resolveWhereToList(data);

    const count = await this.prisma.plantation.count({ where });

    const plantations = await this.prisma.plantation.findMany({
      skip,
      take,
      where,
      orderBy: data.orderBy,
      include: {
        harvest: {
          select: {
            id: true,
            year: true,
            farm: {
              select: {
                id: true,
                name: true,
                city: true,
                state: true,
                totalArea: true,
                farmableArea: true,
                vegetationArea: true,
              },
            },
          },
        },
      },
    });

    return {
      skip,
      take,
      count,
      data: plantations,
    };
  }

  async update(
    data: WhereParams<IPlantation>,
    id: string,
  ): Promise<IPlantation> {
    const dataParsed = data as Prisma.PlantationUpdateInput;

    return this.prisma.plantation.update({
      data: dataParsed,
      where: { id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.plantation.delete({
      where: {
        id,
      },
    });
  }
}

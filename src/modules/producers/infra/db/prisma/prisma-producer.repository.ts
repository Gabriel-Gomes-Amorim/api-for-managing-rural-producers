import { Prisma } from '@prisma/client';
import {
  IFindRequestRepository,
  IListRequestRepository,
  IListResponseRepository,
  WhereParams,
} from 'src/core/repositories';
import { PrismaService } from 'src/shared/infra/prisma/prisma.service';
import { PrismaProducerMapper } from './mapper/prisma-producer-mapper';
import { IProducer } from 'src/modules/producers/entities/producer.entity';
import { IProducersRepository } from 'src/modules/producers/repositories/producer-repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaProducerRepository implements IProducersRepository {
  constructor(private readonly prisma: PrismaService) {}
  mapper = new PrismaProducerMapper();

  async create(
    data: Omit<IProducer, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<IProducer> {
    const producer = await this.prisma.producer.create({
      data,
    });

    return producer;
  }

  async find({
    fields,
    operator,
  }: IFindRequestRepository<IProducer>): Promise<IProducer | null> {
    let where: Prisma.ProducerWhereInput | Prisma.ProducerWhereUniqueInput = {};

    if (operator && Array.isArray(fields)) {
      where = {
        [operator]: fields.map((field) => field as Prisma.ProducerWhereInput),
      };
    } else if (fields) {
      where = fields as Prisma.ProducerWhereInput;
    }

    const producer = await this.prisma.producer.findFirst({
      where,
    });

    return producer;
  }

  async list(
    data: IListRequestRepository<IProducer>,
  ): Promise<IListResponseRepository<IProducer>> {
    const skip = data.skip || 0;
    const take = data.take || 10;

    const where = this.mapper.resolveWhereToList(data);

    const count = await this.prisma.producer.count({ where });

    const producers = await this.prisma.producer.findMany({
      skip,
      take,
      where,
      orderBy: data.orderBy,
      include: {
        farms: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            totalArea: true,
            farmableArea: true,
            vegetationArea: true,
            harvests: {
              select: {
                id: true,
                year: true,
                plantation: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
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
      data: producers,
    };
  }

  async update(data: WhereParams<IProducer>, id: string): Promise<IProducer> {
    const dataParsed = data as Prisma.ProducerUpdateInput;

    return this.prisma.producer.update({
      data: dataParsed,
      where: { id },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.producer.delete({
      where: {
        id,
      },
    });
  }
}

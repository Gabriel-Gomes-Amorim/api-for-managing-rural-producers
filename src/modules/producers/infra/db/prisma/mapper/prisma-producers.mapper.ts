import { setFindTypeToField } from '@/shared/utils/repositories/setFindTypeToField';
import { Prisma } from '@prisma/client';
import { IResolveWhereToList, TField } from 'src/core/repositories';
import { IProducer } from 'src/modules/producers/entities/producer.entity';

export class PrismaProducersMapper {
  resolveWhereToList({
    fields,
    operator = 'AND',
  }: IResolveWhereToList<IProducer>): Prisma.ProducerWhereInput {
    const fieldIsArray = Array.isArray(fields);

    let where: Prisma.ProducerWhereInput = {};

    if (fields && fieldIsArray) {
      const filteredFields = fields
        .filter((field) => field.value)
        .map((field) => this.setWhereTypeToField(field))
        .filter((field) => field !== null);

      if (filteredFields.length > 0) {
        where = { [operator]: filteredFields as Prisma.ProducerWhereInput[] };
      }
    } else if (fields && !fieldIsArray && fields.value) {
      where = this.setWhereTypeToField(fields) as Prisma.ProducerWhereInput;
    }

    return where;
  }

  private setWhereTypeToField(
    field: TField<IProducer>,
  ): Prisma.ProducerWhereInput | null {
    const value = setFindTypeToField<IProducer, Prisma.ProducerWhereInput>(
      field,
    );

    return value as Prisma.ProducerWhereInput | null;
  }
}

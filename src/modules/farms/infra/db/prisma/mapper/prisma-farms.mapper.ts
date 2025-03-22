import { IFarm } from '@/modules/farms/entities/farm.entity';
import { setFindTypeToField } from '@/shared/utils/repositories/setFindTypeToField';
import { Prisma } from '@prisma/client';
import { IResolveWhereToList, TField } from 'src/core/repositories';

export class PrismaFarmsMapper {
  resolveWhereToList({
    fields,
    operator = 'AND',
  }: IResolveWhereToList<IFarm>): Prisma.FarmWhereInput {
    const fieldIsArray = Array.isArray(fields);

    let where: Prisma.FarmWhereInput = {};

    if (fields && fieldIsArray) {
      const filteredFields = fields
        .filter((field) => field.value)
        .map((field) => this.setWhereTypeToField(field))
        .filter((field) => field !== null);

      if (filteredFields.length > 0) {
        where = { [operator]: filteredFields as Prisma.FarmWhereInput[] };
      }
    } else if (fields && !fieldIsArray && fields.value) {
      where = this.setWhereTypeToField(fields) as Prisma.FarmWhereInput;
    }

    return where;
  }

  private setWhereTypeToField(
    field: TField<IFarm>,
  ): Prisma.FarmWhereInput | null {
    const value = setFindTypeToField<IFarm, Prisma.FarmWhereInput>(field);

    return value as Prisma.FarmWhereInput | null;
  }
}

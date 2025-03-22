import { IHarvest } from '@/modules/harvests/entities/harvest.entity';
import { setFindTypeToField } from '@/shared/utils/repositories/setFindTypeToField';
import { Prisma } from '@prisma/client';
import { IResolveWhereToList, TField } from 'src/core/repositories';

export class PrismaHarvestsMapper {
  resolveWhereToList({
    fields,
    operator = 'AND',
  }: IResolveWhereToList<IHarvest>): Prisma.HarvestWhereInput {
    const fieldIsArray = Array.isArray(fields);

    let where: Prisma.HarvestWhereInput = {};

    if (fields && fieldIsArray) {
      const filteredFields = fields
        .filter((field) => field.value)
        .map((field) => this.setWhereTypeToField(field))
        .filter((field) => field !== null);

      if (filteredFields.length > 0) {
        where = { [operator]: filteredFields as Prisma.HarvestWhereInput[] };
      }
    } else if (fields && !fieldIsArray && fields.value) {
      where = this.setWhereTypeToField(fields) as Prisma.HarvestWhereInput;
    }

    return where;
  }

  private setWhereTypeToField(
    field: TField<IHarvest>,
  ): Prisma.HarvestWhereInput | null {
    const value = setFindTypeToField<IHarvest, Prisma.HarvestWhereInput>(field);

    return value as Prisma.HarvestWhereInput | null;
  }
}

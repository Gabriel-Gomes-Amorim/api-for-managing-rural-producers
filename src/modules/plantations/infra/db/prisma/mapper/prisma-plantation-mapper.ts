import { IPlantation } from '@/modules/plantations/entities/plantation.entity';
import { setFindTypeToField } from '@/shared/utils/repositories/setFindTypeToField';
import { Prisma } from '@prisma/client';
import { IResolveWhereToList, TField } from 'src/core/repositories';

export class PrismaPlantationMapper {
  resolveWhereToList({
    fields,
    operator = 'AND',
  }: IResolveWhereToList<IPlantation>): Prisma.PlantationWhereInput {
    const fieldIsArray = Array.isArray(fields);

    let where: Prisma.PlantationWhereInput = {};

    if (fields && fieldIsArray) {
      const filteredFields = fields
        .filter((field) => field.value)
        .map((field) => this.setWhereTypeToField(field))
        .filter((field) => field !== null);

      if (filteredFields.length > 0) {
        where = { [operator]: filteredFields as Prisma.PlantationWhereInput[] };
      }
    } else if (fields && !fieldIsArray && fields.value) {
      where = this.setWhereTypeToField(fields) as Prisma.PlantationWhereInput;
    }

    return where;
  }

  private setWhereTypeToField(
    field: TField<IPlantation>,
  ): Prisma.PlantationWhereInput | null {
    const value = setFindTypeToField<IPlantation, Prisma.PlantationWhereInput>(
      field,
    );

    return value as Prisma.PlantationWhereInput | null;
  }
}

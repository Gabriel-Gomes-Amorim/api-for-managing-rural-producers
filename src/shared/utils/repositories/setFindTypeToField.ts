import { TField } from 'src/core/repositories';

export function setFindTypeToField<T, R>(field: TField<T>): R | unknown {
  switch (field.findType) {
    case 'iLike':
      return {
        [field.key]: {
          startsWith: `%${field.value}%`,
          mode: 'insensitive',
        },
      };
    case 'like':
      return {
        [field.key]: {
          startsWith: `%${field.value}%`,
        },
      };
    default:
      return {
        [field.key]: field.value,
      };
  }
}

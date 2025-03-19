import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCpfOrCnpj',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return cpf.isValid(value) || cnpj.isValid(value);
        },
        defaultMessage(): string {
          return 'Invalid CPF or CNPJ';
        },
      },
    });
  };
}

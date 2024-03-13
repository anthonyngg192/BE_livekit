import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/gm;

export function IsValidPassword(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isValidPassword',
      propertyName,
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return PASSWORD_REGEX.test(value);
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return `${validationArguments.property} must be a valid password`;
        },
      },
    });
  };
}

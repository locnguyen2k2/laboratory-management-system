import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function IsDateGreaterThanOrEqualToday(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateGreaterThanOrEqualToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);

          const inputValue = new Date(value);
          inputValue.setHours(currentDate.getHours());

          return inputValue >= currentDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be greater than or equal to today's date.`;
        },
      },
    });
  };
}

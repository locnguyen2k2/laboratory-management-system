import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsValidString implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    if (text?.startsWith(' ') || text?.endsWith(' ')) {
      return false;
    }
    if (text?.includes('  ')) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Please ensure the text does not contain leading, trailing, or multiple consecutive spaces.';
  }
}
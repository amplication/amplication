import { PUBLIC_DOMAINS } from "./publicDomains";
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ async: true })
export class IsWorkEmailConstraint implements ValidatorConstraintInterface {
  validate(email: string, args: ValidationArguments) {
    const domain = email.split("@")[1];
    return !PUBLIC_DOMAINS.includes(domain);
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsWorkEmail(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsWorkEmailConstraint,
    });
  };
}

import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'selectedServices', async: false })
export class SelectedServicesValidator implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        if (typeof value === 'string') {
            return value.trim().length > 0;
        }

        if (Array.isArray(value)) {
            return value.every(v => Number.isInteger(v) && v > 0);
        }

        return false;
    }

    defaultMessage(): string {
        return 'selectedServices must be a non-empty string or an array of positive integers';
    }
}

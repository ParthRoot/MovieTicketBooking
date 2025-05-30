import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
const { DateTime } = require('luxon');

@ValidatorConstraint({ name: 'isEndDateGreaterThanStartDate', async: false })
export class IsEndDateGreaterThanStartDateConstraint implements ValidatorConstraintInterface {
    validate(endDate: Date, args: ValidationArguments): boolean {
        const [startDateProperty] = args.constraints;
        const object = args.object as any;
        const startDate = object[startDateProperty];
        // Check that startDate and endDate are valid Dates
        if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            console.log('One of the dates is not a valid Date object.');
            return false;
        }
        const isValid = !endDate || !startDate || endDate >= startDate;
        return isValid;
    }
}

export function IsEndDateGreaterThanStartDate(startDateProperty: string, validationOptions?: any) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [startDateProperty],
            validator: IsEndDateGreaterThanStartDateConstraint,
        });
    };
}

export function ValidateMonthYear(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'validateMonthYear',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions ?? {}, // Ensure options is never undefined
            validator: {
                validate(value: any) {
                    const monthYearRegex =
                        /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/;
                    return typeof value === 'string' && monthYearRegex.test(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be in the format "MonthName Year" (e.g., "December 2023").`;
                },
            },
        });
    };
}

export function OneOfFour(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'oneOfThree',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions ?? {},
            validator: {
                validate(_: any, args: ValidationArguments) {
                    const obj = args.object as any;
                    const properties = ['dealer_code_to_compare', 'pv_classification', 'region', 'territory'];
                    const definedProps = properties.filter(
                        (prop) => obj[prop] !== undefined && obj[prop] !== null && obj[prop] !== '',
                    );

                    return definedProps.length === 1; // Only one of the three properties should be defined
                },
                defaultMessage() {
                    return `Only one of the following fields should be provided: dealer_code_to_compare, pv_classification, region, territory.`;
                },
            },
        });
    };
}

export function ValidateStartDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'ValidateStartDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions ?? {},
            validator: {
                validate(_: any, args: ValidationArguments) {
                    const obj = args.object as any;
                    const start_date = DateTime.fromFormat(obj.start_range, 'MMMM yyyy');
                    const end_date = DateTime.fromFormat(obj.end_range, 'MMMM yyyy');
                    if (!start_date.isValid || !end_date.isValid) return false;

                    return start_date < end_date;
                },
                //EX: December 2023 Is start date than end date should not be less than December 2023
                defaultMessage() {
                    return `Start date should not be greater than the End date .`;
                },
            },
        });
    };
}

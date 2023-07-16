export interface IGlobalUtilNumberService {
    convertNumber(value: TNumberString): number | void;
    areNumericValuesEqual(firstValue: TNumberString, secondValue: TNumberString): boolean;
}

export type TNumberString = number | string;

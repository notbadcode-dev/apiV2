export const enum EDataType {
    Number = 'number',
    String = 'string',
    Boolean = 'boolean',
    Object = 'object',
    BigInt = 'bigint',
    Symbol = 'symbol',
    Function = 'function',
    Undefined = 'undefined',
}

export const VALID_DATA_TYPE_TO_NUMBER_LIST: string[] = [EDataType.Number, EDataType.String];

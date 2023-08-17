export type UnparsedParam = null | string;
export type UnparsedQueryParam = UnparsedParam | UnparsedParam[];
export type UnparsedParams<E extends string = string> = Record<E, UnparsedQueryParam>

export type Param = null | boolean | number | string;
export type QueryParam = Param | Param[]
export type Params<E extends string = string> = Record<E, QueryParam>

export type Transform = (param: string) => Param;

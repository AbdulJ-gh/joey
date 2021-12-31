import type { Method, ResolvedHandler } from '../Router';

export declare type RegisteredMethod = { [method in Method]?: ResolvedHandler };
export declare type Paths = Record<string, RegisteredMethod>;

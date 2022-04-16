import { JsonBody } from '../Res';

export declare type PathParams = Record<string, string|string[]>

export declare type RequestBody = Body | string | JsonBody | FormData | Blob | ArrayBuffer | null;

export declare type BodyType = 'plaintext' | 'json' | 'xForm' | 'multiForm' | 'blob' | 'buffer' | null;

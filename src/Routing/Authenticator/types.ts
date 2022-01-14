import type { Res } from '../Res';
import type { Context } from '../Router';

export declare type AuthData = Record<string, unknown> | boolean | null
export declare type AuthHandler = (context: Context) => Promise<AuthData | Res | Response> | AuthData | Res | Response;

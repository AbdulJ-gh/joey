import { Res } from '../Res';
import { Router } from './';

/** Request Types */
export declare interface Req extends Request {
	authData?: Record<string, unknown>;
}

/** Auth Types */
export declare type AuthData = Record<string, unknown> | false | null
export declare type AuthHandler = (context: Context) => Promise<AuthData | Res | Response> | AuthData | Res | Response;

/** Handler Types  */
export declare type Context = { req: Req; res: Res };
export declare type SyncHandler = (context: Context) => Response | Res | void;
export declare type AsyncHandler = (context: Context) => Promise<Response | Res | void>;
export declare type Handler = SyncHandler | AsyncHandler;
export declare type ResolvedHandler = {	handler: Handler;	authenticate: boolean };

/** Routing Types  */
export declare type registeredRoutes = { route: string; handler: Handler }[];
export declare type Method = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';
export declare type Methods = Record<string, registeredRoutes>;

export declare type MethodRegister = { [method in Method]?: ResolvedHandler };
export declare type Paths = Record<string, MethodRegister>;
export declare type Register = {
	paths: Paths;
	routers: Record<string, Router>;
};

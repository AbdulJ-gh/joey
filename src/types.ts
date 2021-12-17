import { Res } from './Routing/Res';
import { Router } from './Routing/Router';

/** Request Types */
export declare interface Req extends Request {
	authData?: Record<any, any>;
}

/** Response Types */
export declare type JsonBody = Record<string, any> | any[];
export declare type BodyType = 'json' | 'formData' | 'arrayBuffer' | 'blob' | 'text';

/** Auth Types */
export declare type AuthData = null | false | Record<any, any>;
export declare type AuthHandler = (req: Request) => AuthData;

/** Handler Types  */
export declare type Context = { req: Req; res: Res }; // Context object

export declare type SyncHandler = (context: Context) => Response | Res | void;
export declare type AsyncHandler = (context: Context) => Promise<Response | Res | void>;
export declare type Handler = SyncHandler | AsyncHandler;

export declare type ResolvedHandler = {
	handler: Handler;
	authenticate: boolean;
	context: any; // App or Router context
};

/** Routing Types  */
export declare type registeredRoutes = { route: string; handler: Handler }[];
export declare type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
export declare type Methods = Record<string, registeredRoutes>;

export declare type MethodRegister = { [method in Method]?: ResolvedHandler };
export declare type Paths = Record<string, MethodRegister>;
export declare type Register = {
	paths: Paths;
	routers: Record<string, Router>;
};

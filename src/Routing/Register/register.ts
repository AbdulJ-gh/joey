import type { Router, Handler, Method } from '../Router';
import type { Paths } from './types';

export class Register {
	public paths: Paths = {};
	public routers: Record<string, Router> = {};
	public allow: Record<string, Set<Method>> = {};

	public static getRegisteredName(routeName: string): string {
		if (routeName === '' || routeName === '/') return '__base_route';
		let route = routeName;
		if (routeName.endsWith('/')) route = route.slice(0, -1);
		if (!routeName.startsWith('/')) route = '/'.concat(route);
		return route;
	}

	public registerMethod(routerContext: Router, method: Method, route: string, handler: Handler, authenticate = true) {
		const name = Register.getRegisteredName(route);

		if (!this.paths[name]) this.paths[name] = {};
		this.paths[name][method] = { routerContext, handler, authenticate };
	}

	public registerRouter(route: string, router: Router): void	{
		this.routers[Register.getRegisteredName(route)] = router;
	}
}

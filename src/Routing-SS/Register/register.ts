import type { Router, Handler, Method } from '../Router';
import type { Paths } from './types';

export class Register {
	public paths: Paths = {};
	public routers: Record<string, Router> = {};

	public static getRegisteredName(routeName: string): string { // In Path
		if (routeName === '' || routeName === '/') return '/';
		let route = routeName;
		if (routeName.endsWith('/')) route = route.slice(0, -1);
		if (!routeName.startsWith('/')) route = '/'.concat(route);
		return route;
	}

	public static getName(pathname: string, reducer: string): string { // In Path
		const registeredName = Register.getRegisteredName(pathname);
		const reducedName = registeredName.slice(reducer.length);
		return reducedName === '' ? '/' : reducedName;
	}

	public registerMethod(routerContext: Router, method: Method, route: string, handler: Handler, authenticate = true) {
		const name = Register.getRegisteredName(route);

		if (!this.paths[name]) this.paths[name] = {};
		this.paths[name][method] = { routerContext, handler, authenticate };
	}

	public registerRouter(route: string, router: Router): void	{
		this.routers[Register.getRegisteredName(route)] = router;
	}

	public matchRoute(route: string, isRouter = false): string | undefined { // In Register as lookup
		return Object.keys(this[isRouter ? 'routers' : 'paths']).find(path => {
			const regex = path.replace(/:[^/]+/g, '[^/]+'); // This line in Path
			return route.match(`^${regex}$`);
		});
	}
}

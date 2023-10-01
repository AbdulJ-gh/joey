import { matchPath } from './path';
import type { Method } from '../types';

export interface Routes<T> {
	[key: string]: {
		[method in Method]?: T;
	};
}

export type Lookup<T> = {
	allowedMethods?: Method[];
	item?: T;
}

export default class Register<T> {
	private routeList: string[];

	constructor(public routes: Routes<T>) {
		this.routeList = Object.keys(routes);
	}

	/** Only returns allowedMethods if route found but no handler */
	public lookup(path: string, method: Method): Lookup<T> {
		const foundRoute = this.routeList.find(route => {
			return matchPath(path, route);
		});

		if (foundRoute) {
			const foundMethod = this.routes[foundRoute][method];
			if (foundMethod) {
				return { item: foundMethod };
			} else {
				return { allowedMethods: Object.keys(this.routes[foundRoute]) as Method[] };
			}
		}
		return {};
	}
}

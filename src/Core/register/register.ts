import { matchPath } from './helpers';
import type { Method } from '../types';

export interface Paths<T> {
	[key: string]: {
		[method in Method]?: T;
	};
}

type Lookup<T> = {
	pathFound: boolean;
	allowedMethods: Method[];
	item?: T;
}

export default class Register<T> {
	constructor(public paths: Paths<T>) {}

	public lookup(path: string, method: Method): Lookup<T> {
		const result: Lookup<T> = {
			pathFound: false,
			allowedMethods: []
		};

		const foundPath = Object
			.keys(this.paths)
			.find(parameterisedPath => matchPath(path, parameterisedPath));

		if (foundPath) {
			result.pathFound = true;
			const foundMethod = this.paths[foundPath][method];
			if (foundMethod) {
				result.item = foundMethod;
			} else {
				result.allowedMethods = Object.keys(this.paths[foundPath]) as Method[];
			}
		}
		return result;
	}
}

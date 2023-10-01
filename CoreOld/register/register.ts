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
	private pathsList: string[];

	constructor(public paths: Paths<T>) {
		this.pathsList = Object.keys(paths);
	}

	public lookup(path: string, method: Method): Lookup<T> {
		const result: Lookup<T> = {
			pathFound: false,
			allowedMethods: []
		};

		const foundPath = this.pathsList.find(parameterisedPath => {
			return matchPath(path, parameterisedPath)
		});

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

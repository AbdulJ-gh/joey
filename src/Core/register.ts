import Path from './path';
import type { Method } from './types';

export interface Paths<T> {
	[key: string]: {
		[method in Method]?: T;
	};
}

export default class Register<T> {
	public paths: Paths<T>;

	constructor(paths: Paths<T>) {
		this.paths = paths;
	}

	// Path found but not method will return string representation of the path
	public lookup(path: string, method: Method): T | string | null {
		const normalisedPath = Path.normalise(path);
		const foundPath = Object.keys(this.paths).find(p => Path.match(normalisedPath, p));

		return foundPath
			? this.paths[foundPath][method] || foundPath
			: null;
	}

	public methods(path: string): Method[] {
		if (this.paths[path]) {
			return Object.keys(this.paths[path]) as Method[];
		}
		return [];
	}
}

import Path from './path';
import type { Method } from './types';

export interface Paths<T> {
	[key: string]: {
		[method in Method]?: T;
	};
}

export default class Register<T> {
	constructor(public paths: Paths<T>) {}

	// Path found but not method will return array of allowed methods
	public lookup(path: string, method: Method): T | Method[] | null {
		const foundPath = Object
			.keys(this.paths)
			.find(p => Path.match(path, p));

		return foundPath
			? this.paths[foundPath][method] || this.methods(path)
			: null;
	}

	public methods(path: string): Method[] {
		if (this.paths[path]) {
			return Object.keys(this.paths[path]) as Method[];
		}
		return [];
	}
}

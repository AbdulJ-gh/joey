import { Method } from './router';
import Path from "./path";

export interface Paths<T> {
	[key: string]: {
		[method in Method]?: T
	}
}

export default class Register<T> {
	public paths: Paths<T> = {}

	public register(path: string, method: Method, item: T): void {
		if (!this.paths[path]) this.paths[path] = {};
		this.paths[path][method] = item;
	}

	public lookup(path: string, method: Method): T | undefined {
		const normalisedPath = Path.normalise(path)
		const foundPath = Object.keys(this.paths).find(p => {
			return Path.match(normalisedPath, p)
		})

		if (foundPath) {
			return this.paths[foundPath][method]
		}
		return;
	}
}


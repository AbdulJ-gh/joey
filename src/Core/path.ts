export default class Path {
	private static normalise(path: string): string {
		if (path === '' || path === '/') return '/'; // Not needed, as lines 5 and 6 do this anyway ?
		let normalised = path;
		if (path.endsWith('/')) normalised = normalised.slice(0, -1);
		if (!path.startsWith('/')) normalised = '/'.concat(normalised);
		return normalised;
	}

	public static match(path: string, parameterisedPath: string): boolean {
		const regex = parameterisedPath.replace(/:[^/]+/g, '[^/]+');
		return this.normalise(path).match(`^${regex}$`) !== null;
	}

	public static reducePathname(path: string, reducer: string): string { // Not in use
		const reducedName = this.normalise(path).slice(reducer.length);
		return reducedName === '' ? '/' : reducedName;
	}

	public static pathHasParams(parameterisedPath: string): boolean {
		return parameterisedPath?.includes('/:') || false;
	}
}

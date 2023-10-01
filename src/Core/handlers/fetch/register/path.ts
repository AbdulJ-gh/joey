function normalisePath(path: string): string {
	if (path === '' || path === '/') return '/';
	let normalised = path;
	if (path.endsWith('/')) normalised = normalised.slice(0, -1);
	if (!path.startsWith('/')) normalised = '/'.concat(normalised);
	return normalised;
}

export function matchPath(path: string, route: string): boolean {
	const regex = route.replace(/:[^/]+/g, '[^/]+');
	return normalisePath(path).match(`^${regex}$`) !== null;
}

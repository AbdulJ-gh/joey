export function getRegisteredName(routeName: string): string {
	if (routeName === '' || routeName === '/') return '__base_route';
	let route = routeName;
	if (routeName.endsWith('/')) route = route.slice(0, -1);
	if (!routeName.startsWith('/')) route = '/'.concat(route);
	return route;
}

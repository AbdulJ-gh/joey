export default class Path {
  public static normalise(path: string): string {
    if (path === '' || path === '/') return '/';
    let normalised = path;
    if (path.endsWith('/')) normalised = normalised.slice(0, -1);
    if (!path.startsWith('/')) normalised = '/'.concat(normalised);
    return normalised;
  };

  public static match(normalisedPath: string, parameterisedPath: string): boolean {
    const regex = parameterisedPath.replace(/:[^/]+/g, '[^/]+');
    return  normalisedPath.match(`^${regex}$`) !== null
  }
}

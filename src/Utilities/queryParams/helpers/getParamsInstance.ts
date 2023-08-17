export function getParamsInstance(url: URL | string): URLSearchParams {
	return url instanceof URL ? url.searchParams : new URL(url).searchParams;
}

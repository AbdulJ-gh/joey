import { getSeconds, TimeString } from '../general';

export function getMaxAge(age: TimeString): string {
	return `Max-Age=${getSeconds(age)}`;
}

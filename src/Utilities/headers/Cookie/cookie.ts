import { getSeconds } from '../../general';
import { getMaxAge } from './../maxAge';
import type { CookieOptions, EpochOrFromNow } from './types';

function getExpires(date: EpochOrFromNow) {
	if (typeof date === 'number') {
		return `Expires=${new Date(date).toUTCString()}`;
	}
	return `Expires=${new Date(Date.now() + (getSeconds(date)) * 1000).toUTCString()}`;
}

function mapOptionsToString(options: CookieOptions) {
	const { expires, maxAge, domain, path, secure, httpOnly, sameSite } = options;
	let opt = '';
	if (expires) { opt += ` ${getExpires(expires)};`;}
	if (maxAge) { opt += ` ${getMaxAge(maxAge)};`;}
	if (domain) { opt += ` Domain=${domain};`; }
	if (path) { opt += ` Path=${path};`; }
	if (secure) { opt += ' Secure;'; }
	if (httpOnly) { opt += ' HttpOnly;'; }
	if (sameSite) { opt += ` SameSite=${sameSite};`; }
	return opt;
}

// mapOptionsToString({ httpOnly: true, secure: true, sameSite: 'Lax', maxAge: '7 days', expires: '52 wk', path: '/auth', domain: 'site.com' });
// ' Expires=Tue, 20 Jan 1970 00:54:53 GMT; Max-Age=604800; Domain=site.com; Path=/auth; Secure; HttpOnly; SameSite=Lax;';


const cookie = {
	set: (headers: Headers, name: string, value: string, options?: CookieOptions) => {
		let cookie = `${name}=${value};`;
		if (options) { cookie += mapOptionsToString(options); }
		headers.append('set-cookie', cookie);
	},
	clear: (headers: Headers, name: string, options?: Pick<CookieOptions, 'domain' | 'path'>) => {
		let cookie = `${name}=; ${getExpires(0)};`;
		if (options) { cookie += mapOptionsToString(options); }
		headers.append('set-cookie', cookie);
	}
};

export { cookie };

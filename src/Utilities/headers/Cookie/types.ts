import { TimeString } from '../../general';

export declare type EpochOrFromNow = number | TimeString;

export declare type CookieOptions = {
	expires?: EpochOrFromNow;
	maxAge?: TimeString;
	domain?: string;
	path?: string;
	secure?: boolean;
	httpOnly?: boolean;
	sameSite?: 'Strict' | 'Lax' | 'None';
};

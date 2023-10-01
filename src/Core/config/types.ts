import type { HandlerBodyType } from '../handlers/fetch/types';
import type { ResponseObject } from '../handlers/fetch/res';

export type DefaultError = ResponseObject<
	Record<string, string>,
	null | string | Record<string, unknown>
>

export type ContentHeaderParseMap = {
	matchers: { query: string, bodyType: HandlerBodyType, matcher: 'inclusive' | 'exclusive' }[];
	fallback: HandlerBodyType;
}

export type DefaultErrors = {
	notFound: DefaultError;
	methodNotAllowed: DefaultError;
	internalServerError: DefaultError;
	validationError: DefaultError;
}

export type Options = {
	headers: Record<string, string>;
	prettifyJson: boolean;
	cloneBody: boolean;
	parseBody: HandlerBodyType | 'header';
	contentHeaderParseMap: ContentHeaderParseMap;
	transformPathParams: boolean;
	transformQueryParams: boolean;
	emitAllowHeader: boolean;
	validationErrors: boolean; // Adds to .error if field does not exist, or appends to new line (per error) if string
	allValidationErrors: boolean;
	passThroughOnException: true
}

export type Config<DE = Partial<DefaultErrors>, O = Partial<Options>> = {
	defaultErrors: DE,
	options: O
};

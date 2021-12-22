import { fetch, Request, Response, Headers } from 'cross-fetch';
import FormData from 'form-data';

globalThis.fetch = fetch;
globalThis.Request = Request;
globalThis.Response = Response;
globalThis.Headers = Headers;
globalThis.FormData = FormData;

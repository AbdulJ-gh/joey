import { fetch, Request, Response, Headers } from 'cross-fetch';
import FormData from 'form-data';
import { webcrypto } from 'crypto';

globalThis.fetch = fetch;
globalThis.Request = Request;
globalThis.Response = Response;
globalThis.Headers = Headers;
globalThis.FormData = FormData;
globalThis.crypto = webcrypto;

import { fetch, Request, Response, Headers, FormData } from 'undici';
import { webcrypto } from 'crypto';

globalThis.fetch = fetch;
globalThis.Request = Request;
globalThis.Response = Response;
globalThis.Headers = Headers;
globalThis.FormData = FormData;
globalThis.crypto = webcrypto;

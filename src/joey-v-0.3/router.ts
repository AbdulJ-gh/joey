import Register, { type Paths } from "./register";
import type { Handler } from "./joey";

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export default class Router {
  protected register: Register<Handler> = new Register;

  protected resolve(path: string, method: Method): Handler|void {
    // Do some resolving and path matching logic here
    console.log(path);
    const route = ''
  }

  private method(method: Method, path: string, handler: Handler): this {
    this.register.register(path, method, handler);
    return this;
  }

  public get(route: string, handler: Handler): this { return this.method('GET', route, handler); }
  public post(route: string, handler: Handler): this { return this.method('POST', route, handler); }
  public put(route: string, handler: Handler): this { return this.method('PUT', route, handler); }
  public patch(route: string, handler: Handler): this { return this.method('PATCH', route, handler); }
  public delete(route: string, handler: Handler): this { return this.method('DELETE', route, handler); }
  public options(route: string, handler: Handler): this { return this.method('OPTIONS', route, handler); }
}

import Router from "./router";
import Register, { type Routes } from "./register";
import Dispatcher from "./dispatcher";
import { string } from "yaml/dist/schema/common/string";


// Don't make routers nested, it will save a lot of headaches and make it easier to isolate

// Joey
// What
// - Be the point of entry for the application
// - Having an app level router
// - implements `fetch` handler entry
// - Custodian of the Register instance
// - generates the context of the request/event
// - Pre check, e.g. url too long ?? This doesn't fit in well here??

// Router
// What
// - Registering handlers
// - Find the correct handler from the register and send the request + context to it

// Register
// What - Main graph structure of the application, used for putting and getting routes and contexts? (i.e. middleware?)

// Dispatcher
// What - Dispatch requests to the relevant handlers, e.g. handler, authHandler, middleware, preCheck handlers

// Responder
// What - Takes the context in to account and generates an appropriate Response object ready for response


// Auth
// What - it's just another ware, is it pointless? Although I see myself having a big need for this

// Ware
// What
// - Standalone handler, can return Res/Response, return, or complete function
// - operate one after the other, no need for `next` call


// type Routers = Record<string, Paths>;

interface Context extends ExecutionContext {
  // Placeholders
  req: string;
  res: string;
  logger: string
}

type SyncMiddlewareHandler = (ctx: Context) => Response|void
type AsyncMiddlewareHandler = (ctx: Context) => Promise<Response|void>;
type MiddlewareHandler =  SyncMiddlewareHandler | AsyncMiddlewareHandler;

type SyncHandler = (ctx: Context) => Response
type AsyncHandler = (ctx: Context) => Promise<Response>;
export type Handler = SyncHandler | AsyncHandler;


type Routers = Record<string, Routes>;

export default class Joey extends Router {
  public routers: Routers = {};

  constructor(input: unknown) {
    super();
    console.log(input);
  };

  public fetch: ExportedHandlerFetchHandler = (request, env, ctx) => {
    ctx.passThroughOnException() // The pass through server needs to be defined somewhere?
    try {
      // Find the handler from the register
      // Get the `response` object from the Dispatcher
      const handler = this.resolve('', 'POST');
      return new Dispatcher().dispatch()
    } catch (err) {
      return new Response(null, { status: 500 })
    }
  }
}

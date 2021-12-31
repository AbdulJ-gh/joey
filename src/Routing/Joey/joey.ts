import { Dispatcher } from '../Dispatcher';
import { Res } from '../Res';
import { Router } from '../Router';
import { baseConfig, Config } from '../config';
import type { Context } from '../Router';


class Joey extends Router {
	protected config: Config = baseConfig;
	protected context: Context = { req: new Request(''), res: new Res };

	constructor() {
		super();
		addEventListener('fetch', (event: FetchEvent): void => {
			const { body, status, headers, prettifyJson } = this.config;
			this.context = {
				req: event.request,
				res: new Res().set({ body, status, headers, pretty: prettifyJson })
			};

			const resolvedHandler = this.resolveHandler(event.request, this);
			new Dispatcher(resolvedHandler.routerContext).dispatch(event, resolvedHandler, this.context);
		});
	}

	/** Config */
	public configure(config: Partial<Config>): this {
		this.config = { ...baseConfig, ...config };
		return this;
	}
}

export default () => new Joey();

import type { Config, DefaultErrors, Options } from './types';
import { baseConfig } from './base';

// I don't like this
export class ConfigInstance {
	// eslint-disable-next-line no-use-before-define
	private static configInstance: ConfigInstance;
	private global: Config<DefaultErrors, Options> = baseConfig;
	private local: Partial<Config> | null = null;

	private constructor() {}

	private static get Instance() {
		return this.configInstance || (this.configInstance = new this());
	}

	public static initGlobal(config: Partial<Config>): Config<DefaultErrors, Options> {
		Object.assign(this.Instance.global.defaultErrors, config.defaultErrors);
		const headers = { ...this.Instance.global.options.headers, ...config.options?.headers };
		Object.assign(this.Instance.global.options, config.options);
		this.Instance.global.options.headers = headers;
		return this.Instance.global;
	}

	public static initLocal(config: Partial<Config>): Config<DefaultErrors, Options> {
		const headers = { ...this.Instance.global.options.headers, ...config.options?.headers };
		this.Instance.local = {
			defaultErrors: { ...this.Instance.global.defaultErrors, ...config.defaultErrors },
			options: { ...this.Instance.global.options, ...config.options, headers }
		};
		return this.Instance.local as Config<DefaultErrors, Options>;
	}

	public static get defaultErrors(): DefaultErrors {
		return (this.Instance.local || this.Instance.global).defaultErrors as DefaultErrors;
	}

	public static get options(): Options {
		return (this.Instance.local || this.Instance.global).options as Options;
	}

	public static get config(): Config<DefaultErrors, Options> {
		return (this.Instance.local || this.Instance.global) as Config<DefaultErrors, Options>;
	}
}

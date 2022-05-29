import { defaultConfig } from '../config';

export default function applyDefault(obj: any): any {
	function apply(prop: string, value: any) {
		if (!obj[prop]) { obj[prop] = value }
	}

	function applyOptions(prop: string, value: any) {
		if (!obj.config[prop]) { obj.config[prop] = value }
	}

	apply('src', './src')
	apply('handlersRoot', 'handlers')
	applyOptions('middleware', [])


	obj.config.options = {
		...defaultConfig,
		...obj.config.options
	}

	return obj;
}

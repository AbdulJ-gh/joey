import { defaultConfig } from '../config';

export default function applyDefault(obj: any): any {
	function apply(prop: string, value: any) {
		if (!obj[prop]) { obj[prop] = value }
	}

	function applyOptions(prop: string, value: any) {
		if (!obj.baseConfig[prop]) { obj.baseConfig[prop] = value }
	}

	apply('src', './src')
	apply('handlersRoot', 'handlers')
	applyOptions('middleware', [])


	obj.baseConfig.options = {
		...defaultConfig,
		...obj.baseConfig.options
	}

	return obj;
}

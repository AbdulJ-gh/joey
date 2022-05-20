export default function applyDefault(obj: any): any {
	function apply(prop: string, value: any) {
		if (!obj[prop]) { obj[prop] = value }
	}

	function applyBaseOptions(prop: string, value: any) {
		if (!obj.baseConfig[prop]) { obj.baseConfig[prop] = value }
	}

	apply('src', './src')
	apply('handlersRoot', 'handlers')
	applyBaseOptions('middleware', [])
	return obj;
}

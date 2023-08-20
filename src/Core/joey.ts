import type {
	ExportedHandler,
	ExportedHandlerQueueHandler,
	ExportedHandlerScheduledHandler
} from '@cloudflare/workers-types';

import {
	fetch,
	queue, type QueueTask,
	scheduled, type CronJobs,
	email
} from './handlers';


type Register = Record<keyof ExportedHandler, {
	method: string
}>


// fetch - method + route
// scheduled - cron
// queue - one off


export default class Joey implements ExportedHandler {
	readonly register: Register;
	readonly cronJobs: CronJobs = {};
	readonly queueTask: QueueTask;
	readonly queue: ExportedHandlerQueueHandler;

	constructor(
		public readonly cronJobs: CronJobs = {
			'*/1 * * * *': (ctx) => {
				console.log('THIS IS IN THE ACTUAL HANDLER', ctx.controller.cron);
			}
		},
		public readonly queueTask: QueueTask = () => {
			console.log('THIS IS A QUEUE TASK');
		}
	) {
	}

	public fetch = fetch;

	public queue: ExportedHandlerQueueHandler = async (...args: unknown[]): Promise<void> => {
		queue({
			task: this.queueTask,
			logger: 'placeholder'
		})(...args);
	};

	public scheduled: ExportedHandlerScheduledHandler = async (...args: unknown[]): Promise<void> => {
		scheduled({
			jobs: this.cronJobs,
			logger: 'placeholder'
		})(...args);
	};

	public email = email;
}

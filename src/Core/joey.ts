import type {
	ExportedHandler,
	ExportedHandlerQueueHandler,
	ExportedHandlerScheduledHandler
} from '@cloudflare/workers-types';

import {
	fetch,
	queue, type MessageQueueTasks,
	scheduled, type CronJobs,
	email
} from './handlers';


type Register = Record<keyof ExportedHandler, {
	method: string
}>


// fetch - method + route
// scheduled - cron
// queue - Can consume multiple queue, and will start of in batch process


const initialCronJobs: CronJobs = {
	'*/1 * * * *': (ctx) => {
		console.log('THIS IS IN THE ACTUAL HANDLER', ctx.controller.cron);
	}
};

const initialMessageQueueTasks: MessageQueueTasks = {
	'name-o-queue': {
		processMode: 'aggregate',
		handler: (ctx) => {
			console.log('THIS IS A QUEUE TASK', ctx.batch.queue);
		},
		validator: () => true,
		deadLetterQueue: 'NAME-O-DLQ'
	}
};

export default class Joey implements ExportedHandler {
	readonly register: Register;
	readonly cronJobs: CronJobs;
	readonly messageQueueTask: MessageQueueTasks;

	constructor(
		public readonly cronJobs: CronJobs = initialCronJobs,
		public readonly messageQueueTask: MessageQueueTasks = initialMessageQueueTasks
	) {
	}

	public fetch = fetch;

	public queue: ExportedHandlerQueueHandler = async (...args: unknown[]): Promise<void> => {
		queue({
			tasks: this.messageQueueTask,
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

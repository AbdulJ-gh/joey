import type {
	ExportedHandler,
	ExportedHandlerQueueHandler,
	ExportedHandlerScheduledHandler,
	ExecutionContext,
	MessageBatch,
	ScheduledController
} from '@cloudflare/workers-types';

import {
	fetch,
	queue, type MessageQueueTasks,
	scheduled, type CronJobs,
	email
} from './handlers';


type Register = Record<string, unknown>


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

type QueueArgs = [MessageBatch, unknown, ExecutionContext]
type ScheduledArgs = [ScheduledController, unknown, ExecutionContext]

export default class Joey implements ExportedHandler {
	public readonly register;
	public readonly cronJobs: CronJobs;
	public readonly messageQueueTask: MessageQueueTasks;

	constructor(
		register: Register = {},
		cronJobs: CronJobs = initialCronJobs,
		messageQueueTask: MessageQueueTasks = initialMessageQueueTasks
	) {
		this.register = register;
		this.cronJobs = cronJobs;
		this.messageQueueTask = messageQueueTask;
	}

	public fetch = fetch;

	public queue: ExportedHandlerQueueHandler = async (...args: QueueArgs): Promise<void> => {
		await queue({
			tasks: this.messageQueueTask,
			logger: 'placeholder'
		})(...args);
	};

	public scheduled: ExportedHandlerScheduledHandler = async (...args: ScheduledArgs): Promise<void> => {
		await scheduled({
			jobs: this.cronJobs,
			logger: 'placeholder'
		})(...args);
	};

	public email = email;
}

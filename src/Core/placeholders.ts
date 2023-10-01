import type { CronJobs, MessageQueueTasks } from './handlers';

// fetch - method + route
// scheduled - cron, up to three currently
// queue - Can consume multiple queue, and will start of in batch process

export const initialCronJobs: CronJobs = {
	'*/1 * * * *': (ctx) => {
		console.log('THIS IS IN THE ACTUAL HANDLER', ctx.controller.cron);
	}
};

export const initialMessageQueueTasks: MessageQueueTasks = {
	'name-o-queue': {
		processMode: 'aggregate',
		handler: (ctx) => {
			console.log('THIS IS A QUEUE TASK', ctx.batch.queue);
		},
		validator: () => true,
		deadLetterQueue: 'NAME-O-DLQ'
	}
};

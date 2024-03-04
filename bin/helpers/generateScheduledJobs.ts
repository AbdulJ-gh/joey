import type { ScheduledHandlers } from '../config';
import type { CronJobs } from '../types';
import { ERRORS, throwBuildError } from '../errors';
import { Composer } from '../io';

export function generateScheduledJobs(scheduledHandlers: ScheduledHandlers): CronJobs {
	const scheduledJobs: CronJobs = {}; // cron to handler, e.g. `"* * * * *": cronHandler `
	const jobs = Object.entries(scheduledHandlers);

	jobs.forEach(([name, job]) => {
		if (scheduledJobs[job.cron]) {
			throwBuildError(ERRORS.DUPLICATE_CRON_JOB(job.cron));
		}
		scheduledJobs[job.cron] = Composer.UNSAFE_REF(name);
	});

	return scheduledJobs;
}

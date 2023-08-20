import { EmailExportedHandler } from '@cloudflare/workers-types';

export const email: EmailExportedHandler = async (
	message,
	env,
	ctx
): Promise<void> => {
	console.log(message, env, ctx);
};

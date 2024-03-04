export function joeyLog(message: string): void {
	console.log(`\x1b[33m[${new Date().toISOString()}]\x1b[0m 🦘 ${message}`);
}

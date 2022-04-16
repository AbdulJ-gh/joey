type TimeUnit =
	| 'm' | 'min' | 'mins' | 'minute' | 'minutes'
	| 'h' | 'hr' | 'hrs' | 'hour' | 'hours'
	| 'd' | 'day' | 'days'
	| 'w' | 'wk' | 'wks' | 'week' | 'weeks'

const mins = ['m', 'min', 'mins', 'minute', 'minutes'];
const hrs = ['h', 'hr', 'hrs', 'hour', 'hours'];
const days = ['d', 'day', 'days'];
const weeks = ['w', 'wk', 'wks', 'week', 'weeks'];
const timeUnits: string[][] = [mins, hrs, days, weeks];

export type TimeString = `${number} ${TimeUnit}`

export function getSeconds(timeString: TimeString): number {
	const [val, unit] = timeString.split(' ');
	const time = Number.parseInt(val, 10);
	if (Number.isNaN(time)) { return 0; }
	const multipliers: number[] = [60, 3600, 86400, 604800];
	for (let i = 0; i < timeUnits.length; i++) {
		if (timeUnits[i].includes(unit)) {
			return time * multipliers[i];
		}
	}
	return 0;
}

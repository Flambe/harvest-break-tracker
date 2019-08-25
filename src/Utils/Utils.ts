import {Duration} from 'moment';

const breaks = {
	Break: null,
	'Non-Project Time': ['German']
};

export function isBreak(entry): boolean {
	if (breaks[entry.project.name] !== undefined) {
		if (!breaks[entry.project.name] || breaks[entry.project.name].indexOf(entry.task.name) > -1) {
			return true;
		}
	}

	return false;
}

export function durationToHuman(inp: Duration) {
	const hours = Math.floor(Math.abs(inp.asHours()));
	let output = '';

	if (hours > 0) {
		output = `${hours}h `;
	}

	return `${output}${Math.abs(inp.minutes())}m`;
}

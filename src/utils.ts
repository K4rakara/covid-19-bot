export function isNoneOf(value:any, ...toCheck:any[]):boolean {
	let found: boolean = false;
	toCheck.forEach((check: any): void => {
		if (check === value) found = true;
	});
	return found;
}
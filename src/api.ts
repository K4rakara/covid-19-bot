import fs from 'fs';
import path from 'path';
import unirest from 'unirest';
import { Covid19Stats } from './covid19-stats';

interface ApiRes {
	data: {
		covid19Stats: {
			province: string;
			country: string;
			lastUpdate: string;
			confirmed: number;
			deaths: number;
			recovered: number;
		}[]
	}
}

const apiKey: string = fs.readFileSync(path.join(__dirname, '../../covid-api-key.txt'), 'utf8');

function apiReq(country?:string) {
	const req = unirest('GET', 'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats');
	if (country != null) {
		req.query({
			country
		});
	}
	req.headers({
		'x-rapidapi-host': 'covid-19-coronavirus-statistics.p.rapidapi.com',
		'x-rapidapi-key': `${apiKey}`,
	});
	return req;
}

export async function getAll(): Promise<Covid19Stats|Error> {
	const req = apiReq();
	const res = await new Promise((resolve: (value: ApiRes|Error) => any) => {
		req.end(function(response) {
			if (response.error) resolve(new Error(response.error));
			resolve(response.body);
		});
	});
	if (!(res instanceof Error)) {
		try {
			const totals: Covid19Stats = {
				cases: 0,
				deaths: 0,
				recoveries: 0,
				lastUpdate: res.data.covid19Stats[0].lastUpdate,
			}
			res.data.covid19Stats.forEach((province):void => {
				totals.cases += province.confirmed;
				totals.deaths += province.deaths;
				totals.recoveries += province.recovered;
			});
			return totals;
		} catch(err) {
			return new Error("(●︿●) Encountered a JavaScript error... Sorry...");
		}
	} else {
		return new Error("(●︿●) Encountered an API error... Sorry...");
	}
}

export async function getCountry(country: string): Promise<Covid19Stats|Error> {
	const req = apiReq(country);
	const res = await new Promise((resolve: (value: ApiRes|Error) => any) => {
		req.end(function(response) {
			if (response.error) resolve(new Error(response.error));
			resolve(response.body);
		});
	});
	if (!(res instanceof Error)) {
		try {
			const totals: Covid19Stats = {
				cases: 0,
				deaths: 0,
				recoveries: 0,
				lastUpdate: res.data.covid19Stats[0].lastUpdate,
			}
			res.data.covid19Stats.forEach((province):void => {
				totals.cases += province.confirmed;
				totals.deaths += province.deaths;
				totals.recoveries += province.recovered;
			});
			return totals;
		} catch(err) {
			return new Error("(●︿●) Encountered a JavaScript error... Sorry...");
		}
	} else {
		return new Error("(●︿●) Encountered an API error... Sorry...");
	}
}

export async function getProvince(country: string, provinceName: string): Promise<Covid19Stats|Error> {
	const req = apiReq(country);
	const res = await new Promise((resolve: (value: ApiRes|Error) => any) => {
		req.end(function(response) {
			if (response.error) resolve(new Error(response.error));
			resolve(response.body);
		});
	});
	if (!(res instanceof Error)) {
		try {
			const totals: Covid19Stats = {
				cases: 0,
				deaths: 0,
				recoveries: 0,
				lastUpdate: res.data.covid19Stats[0].lastUpdate,
			}
			res.data.covid19Stats.forEach((province):void => {
				if (province.province == provinceName) {
					totals.cases += province.confirmed;
					totals.deaths += province.deaths;
					totals.recoveries += province.recovered;
				}
			});
			return totals;
		} catch(err) {
			return new Error("(●︿●) Encountered a JavaScript error... Sorry...");
		}
	} else {
		return new Error("(●︿●) Encountered an API error... Sorry...");
	}
}

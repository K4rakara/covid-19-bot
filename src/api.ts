import fs from 'fs';
import unirest from 'unirest';
import { Covid19Stats } from './covid19-stats';

interface ApiRes {
	data: {
		covid19Stats: {
			country: string;
			lastUpdate: string;
			confirmed: number;
			deaths: number;
			recovered: number;
		}[]
	}
}

const apiKey: string = fs.readFileSync('../../covid-api-key.txt', 'utf8');

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
			const gotCountries: string[] = [];
			const totals: Covid19Stats = {
				cases: 0,
				deaths: 0,
				recoveries: 0,
			}
			res.data.covid19Stats.forEach((country):void => {
				if (!gotCountries.includes(country.country)) {
					gotCountries.push(country.country);
					totals.cases += country.confirmed;
					totals.deaths += country.deaths;
					totals.recoveries += country.recovered;
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
			return {
				country: res.data.covid19Stats[0].country,
				cases: res.data.covid19Stats[0].confirmed,
				deaths: res.data.covid19Stats[0].deaths,
				recoveries: res.data.covid19Stats[0].recovered,
			}
		} catch(err) {
			return new Error("(●︿●) Encountered a JavaScript error... Sorry...");
		}
	} else {
		return new Error("(●︿●) Encountered an API error... Sorry...");
	}
}

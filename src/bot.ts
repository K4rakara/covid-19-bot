import fs from 'fs';
import path from 'path';
import discord from 'discord.js';
import chalk from 'chalk';
import { getAll, getCountry, getProvince } from './api';
import { isNoneOf } from './utils';
import { Covid19Stats } from './covid19-stats';

const client = new discord.Client();

class CovidStatsWidget extends discord.MessageEmbed {
	constructor(stats: Covid19Stats, scope: string) {
		super();
		this.setColor(4886754);
		this.setTitle(`${scope} statistics:`);
		this.addField('Cases', `${stats.cases}`);
		this.addField('Deaths', `${stats.deaths}`);
		this.addField('Recoveries', `${stats.recoveries}`);
		this.addField('Mortality rate', `${Math.round((stats.deaths / (stats.deaths + stats.recoveries)) * 100)}%`);
		this.addField('Recovery rate', `${Math.round((stats.recoveries / (stats.deaths + stats.recoveries)) * 100)}%`);
		this.setFooter('Data made availible by Center for Systems Science and Engineering at Johns Hopkins University. Last updated');
		this.setTimestamp(new Date(stats.lastUpdate));
	}
}

const validCountries = JSON.parse(fs.readFileSync(path.join(__dirname, '../../countries.json'), 'utf8'));
const validCountryAliases = JSON.parse(fs.readFileSync(path.join(__dirname, '../../country-aliases.json'), 'utf8'));

client.on('message', (message: discord.Message): void => {
	(async (): Promise<void> => {
		try {
			if (message.content.length >= 6 && message.content.toLowerCase().startsWith('covid?')) {
				const split = message.content.split('?');
				split.shift();
				if (split[0] != null && split[0].toLowerCase() === 'help') {
					message.channel.send(new discord.MessageEmbed({
						title: '🩹 Help',
						description: 'Quick help for the Covid 19 Bot:',
						color: 4886754,
						fields: [
							{ name: 'covid?help', value: 'Displays this help menu.' },
							{ name: 'covid?source', value: 'Provides a direct link to the source of this bots data.' },
							{ name: 'covid?countries', value: 'Lists out every country that can be used with this bot.' },
							{ name: 'covid?all', value: 'Displays worldwide statistics.' },
							{ name: 'covid?country', value: 'Displays statistics for `country`.\nExample: ```covid?America```' },
							{ name: 'covid?country?province', value: 'Displays statistics for `province`. In the case of the US, "province" refers to states.\nExample: ```covid?America?New York```' },
						],
						footer: { text: 'Data made availible by Center for Systems Science and Engineering at Johns Hopkins University.' }
					}));
				} else if (split[0] != null && split[0].toLowerCase() === 'source') {
					message.channel.send('Here ya\' go! https://github.com/CSSEGISandData/COVID-19');
				}  else if (split[0] != null && split[0].toLowerCase() === 'countries') {
					message.channel.send(`Heres a list of every country I know: ${Object.keys(validCountries).join(", ")}`)
				} else if (split[0] != null && split[0].toLowerCase() === 'all') {
					const apiRes = await getAll();
					if (!(apiRes instanceof Error)) {
						message.channel.send(new CovidStatsWidget(apiRes, 'Global'));
					} else {
						message.channel.send(apiRes.message);
					}
				} else if (split[0] != null) {
					split.forEach((splitString: string, i: number): void => {
						const words = splitString.split(" ");
						words.forEach((word: string, i: number):void => {
							if (word.length !== 2) {
								words[i] = word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
							} else {
								words[i] = word.toUpperCase();
							}
						});
						split[i] = words.join(" ");
					});
					let ok = false;
					if (Object.keys(validCountries).includes(split[0])) {
						ok = true;
					} else if (Object.keys(validCountryAliases).includes(split[0])) {
						ok = true;
						split[0] = validCountryAliases[split[0]];
					}
					if (split.length === 1 && split[0].length > 1 && ok) {
						const apiRes = await getCountry(split[0]);
						if (!(apiRes instanceof Error)) {
							message.channel.send(new CovidStatsWidget(apiRes, split[0]));
						} else {
							message.channel.send(apiRes.message);
						}
					} else if (split.length === 2 && split[1].length > 1 && ok) {
						const apiRes = await getProvince(split[0], split[1]);
						if (!(apiRes instanceof Error)) {
							message.channel.send(new CovidStatsWidget(apiRes, split[1]));
						} else {
							message.channel.send(apiRes.message);
						}
					} else if (!ok) {
						message.channel.send('(●︿●) Wasn\'t able to find that place... see `covid?countries` for a list of the ones I know.');
					} else {
						message.channel.send('(●︿●) Improper usage... use `covid?help` for help.');
					}
				} else {
					message.channel.send('(●︿●) Improper usage... use `covid?help` for help.');
				}
			}
		} catch(err) {
			console.log(chalk.red(`Encountered an error while parsing a message:\n${err}`));
		}
	})();
});

client.on('ready', (): void => {
	client.user?.setPresence({activity: { name: 'Plague Inc.', type: 'PLAYING' }, status: 'online' });
});

export function start(token: string): void {
	client.login(token);
}

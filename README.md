# Covid 19 Bot
A little Discord bot for helping y'all stay safe :^)

### Usage
- covid?help
	- Displays this help menu.
- covid?source
	- Provides a direct link to the source of this bots data.
- covid?all
	- Displays worldwide statistics.
- covid?country
	- Displays statistics for `country`.
	- Example: `covid?America`
- covid?country?province
	- Displays statistics for `province`. In the case of the US, "province" refers to states.
	- Example: `covid?America?New York`

### Adding the bot to your server
Currently awaiting approval on [top.gg](https://top.gg).

### Running locally
To run the bot on your own computer, you will need the following:
- A Discord application, which can be created through the [Discord developer portal](https://discordapp.com/developers/applications/). Said application needs to have a bot user on it.
- A [RapidApi](https://rapidapi.com/) account, which you then use to subscribe to [this](https://rapidapi.com/KishCom/api/covid-19-coronavirus-statistics/details) API.
- Node & NPM. They can be downloaded [here](https://nodejs.org/en/), or through a package manager on Linux based systems.
- TypeScript installed globally through npm. `npm i -g typescript` once NPM is installed.
- Git. This can be installed via a package manager on Linux and MacOS, and installed via [Git for Windows](https://git-scm.com/download/win) on Windows.

Once those requirements are met, these instructions can be followed.

Use this git command to clone the repo locally:
```
git clone https://github.com/K4rakara/covid-19-bot.git
```

Then, use `npm install` to install the required packages:

Then, place the token for your Discord applications bot into `discord-api-key.txt`, and the RapidApi key into `corona-api-key.txt`.

Finally, run `tsc` to compile the TypeScript code into usable JavaScript.

And thats it! To run the project, simply use `node ./bin/index.js`.

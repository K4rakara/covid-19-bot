import fs from 'fs';
import * as bot from './src/bot';

const token: string = fs.readFileSync('discord-api-key.txt', 'utf8');

bot.start(token);

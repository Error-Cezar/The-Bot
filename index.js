'use strict';
const app = require(`${process.cwd()}/server.js`);
app.listen(3000, () => console.log('Local app listening on port 3000!'));

const fs = require("fs");
let exec = require('child_process').exec;
const { Client, Intents, Collection } = require('discord.js');
require("dotenv").config();

console.log(`[BOT] => Client loaded.`)
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES] });
client.Connection
client.recordable = new Map();

console.log(`[BOT] => DataBase loaded.`)

console.log(`[BOT] => Starting up commands.`)
client.commands = new Collection();
const commandFiles = fs.readdirSync(`${process.cwd()}/commands`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`${process.cwd()}/commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
	console.log(`[BOT] => ${command.data.name}.js loaded.`)
}

console.log(`[BOT] => Starting up events.`)
const eventFiles = fs.readdirSync(`${process.cwd()}/events`).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`${process.cwd()}/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	console.log(`[BOT] => ${event.name}.js loaded.`)
}

console.log(`[BOT] => Starting up modules.`)
fs.readdir(`${process.cwd()}/modules/`, (err, files) => {
    if (err) {
        throw err
    }
    for (const file of files) {
        if (!file.endsWith(".js")) continue;
        require(`${process.cwd()}/modules/${file}`)(client);
		console.log(`[BOT] => ${file} loaded.`)
    }
});

client.DefaultSettings = {
	welcomeChannel: 'none',
	welcomeMsg: 'Welcome to **{{server}}** {{user}} !',

}



//client.user.setActivity('Hillview County', { type: 'WATCHING' });
client.login(process.env.TOKEN).catch(err => {
	exec('kill 1',
    function (error, stdout, stderr) {
        console.log("Error occured, trying to change proccess.")
    });
});
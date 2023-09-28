process.traceDeprecation = false
const { REST, Routes, Client, Events, GatewayIntentBits, Collection } = require('discord.js')
const { token, clientID, guildID, TTV_ID, TTV_Token, TTV_User, mongoURI } = require('./config.json')
const { MongoClient } = require('mongodb')
const mClient = new MongoClient(mongoURI)
exports.mClient = mClient;
const fs = require('node:fs')
const path = require('node:path')
const channels = ['desq_blocki', 'x__hel__x']
const DiscordClient = new Client({intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
]})
exports.DiscordClient = DiscordClient

const HelixAPI = require("simple-helix-api").default;
const tmi = require('tmi.js')
const Helix = new HelixAPI({
    client_id: TTV_ID,
    access_token: TTV_Token
});
exports.Helix = Helix

const TwitchClient = new tmi.Client({
    options: { debug: false },
    connection: {
        reconnect: true,
        secure: true,
    },
    identity: {
        username: TTV_User,
        password: `oauth:${TTV_Token}`
    },
    channels: channels
})
TwitchClient.connect().then(exports.TwitchClient = TwitchClient)
// --------------------

// Init Command Handler
DiscordClient.commands = new Collection() // used internally by interactions
let commands = [] // only used for REST API

const foldersPath = path.join(__dirname, 'discord-commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
            DiscordClient.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Init Rest API
const rest = new REST().setToken(token);
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientID, guildID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
// --------------------

// Init Event Handler
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = require(filePath)
    if(event.once) {
        DiscordClient.once(event.name, (...args) => event.execute(...args))
        // added client to commomerate global usage
    } else {
        DiscordClient.on(event.name, (...args) => event.execute(...args))
        // added client to commomerate global usage
    }
}
// --------------------

// Login
DiscordClient.login(token)
// --------------------

TwitchClient.on('connected', (address, port) => {
    DiscordClient.emit('TwitchOnConnected', address, port)
})
//does stuff when successfully connected

TwitchClient.on('message', (channel, userstate, message, self) => {
    DiscordClient.emit('TwitchOnMessage', channel, userstate, message, self)
})
//does stuff when messages are sent

TwitchClient.on('raided', (channel, username, raiders) => {
    DiscordClient.emit('TwitchOnRaided', channel, username, raiders)
})
//does stuff when channel is being raided

TwitchClient.on('hosted', (channel, username, viewers, autohost) => {
    DiscordClient.emit('TwitchOnHosted', channel, username, viewers, autohost)
})
//does stuff when channel is being hosted

TwitchClient.on('subscribers', (channel, enabled) => {
    DiscordClient.emit('TwitchOnSubOnly', channel, enabled)
})
//does stuff when entering subscriber only mode


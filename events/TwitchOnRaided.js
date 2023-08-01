const Modules = require('../index')
const TwitchClient = Modules.TwitchClient
const DiscordClient = Modules.DiscordClient
module.exports = {
    name: 'TwitchOnRaided',
    once: false,
    async execute(channel, username, raiders) {
        TwitchClient.say(channel, `${username} entrusted us with ${raiders} people of their community, welcome xhelxBlankie`)
        DiscordClient.emit('TwitchShoutout', "RAID", channel, username)
    }
}
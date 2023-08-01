const Modules = require('../index')
const TwitchClient = Modules.TwitchClient
const DiscordClient = Modules.DiscordClient
module.exports = {
    name: 'TwitchOnRaided',
    once: false,
    async execute(channel, username, viewers, autohost) {
        TwitchClient.say(channel, `${username} is now hosting for ${viewers} viewers xhelxBlankie`)
        DiscordClient.emit('TwitchShoutout', "HOST", channel, username)
    }
}
const { TTV_Prefix } = require('../config.json')
const knownBots = new Set(['streamlabs', 'nightbot', 'moobot', 'soundalerts', 'streamelements', 'remasuri_bot', 'commanderroot','x__hel_bot__x'])
const Modules = require('../index')
const TwitchClient = Modules.TwitchClient
const DiscordClient = Modules.DiscordClient
const mClient = Modules.mClient
module.exports = {
    name: 'TwitchOnMessage',
    once: false,
    async execute(channel, userstate, message, self) {
        if (self) { return }
        if (knownBots.has(userstate.username)) { return }

        if (message.toLowerCase().includes('caw')) {
            TwitchClient.say(channel, 'CAW!')
        } else if (message.toLowerCase().includes('kweh')) {
            TwitchClient.say(channel, 'KWEH!')
        } else if (message.toLowerCase().includes('kaw')) {
            TwitchClient.say(channel, 'KAW!')
        }

        if (message.startsWith(TTV_Prefix)) {
            const args = message.substring(1).split(" ")
            const cmd = args[0]
            switch (cmd) {
                case "test":
                    //TwitchClient.say(channel, "/me This is a test message")
                    break;
                case "mode":
                    if (userstate.username != "desq_blocki") { return }
                    let regex = /^(on|off)$/
                    if (!args[1].match(regex)) { return }
                    updateChatMode(await getIDByName(channel.substring(1)), args[1])
                    break;
                default:
                    break;
            }
        }

        // ---------------VIP Handler--------------------
        if (!userstate.badges?.vip) { return }
        verifyUser(channel, userstate.username)
        // ---------------------------------------------

        async function verifyUser(channel, username) {
            let db = mClient.db("shoutouts")
            let col = db.collection(channel)
        
            let query = { user: username }
            let status = await col.findOne(query)
            if (!status) {
                DiscordClient.emit('TwitchShoutout', "VIP", channel, username)
                await col.insertOne({
                    user: username
                })
            }
        }
    }
    
}
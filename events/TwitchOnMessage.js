const { mClient, DiscordClient, TwitchClient, Helix } = require('..')
const { TTV_Prefix, TTV_ModID } = require('../config.json')
const knownBots = new Set(['streamlabs', 'nightbot', 'moobot', 'soundalerts', 'streamelements', 'remasuri_bot', 'commanderroot', 'x__hel_bot__x'])
async function updateChatMode(userID, setTo) {
    let state
    if (setTo === 'on') {
        state = true
    } else if (setTo === 'off') {
        state = false
    } else {
        return
    }
    await Helix.chat.updateSettings(userID, TTV_ModID, {
        follower_mode: state,
        follower_mode_duration: 0,
        subscriber_mode: state,
        emote_mode: state
    });
}
async function getIDByName(user) {
    const result = await Helix.users.get(user);
    return result.data[0].id
}
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
                // case "test":
                //     TwitchClient.say(channel, "/me This is a test message")
                //     break;
                case "mode":
                    if (userstate.badges.moderator != 1 && userstate.badges.broadcaster != 1) { break } // return stops all further operations, so you should just break out of switch
                    let regex = /^(on|off)$/
                    if (!args[1].match(regex)) { break }
                    updateChatMode(await getIDByName(channel.substring(1)), args[1])
                    break;
                default:
                    break;
            }
        }
        // ---------------VIP Handler-------------------
        if (!userstate.badges?.vip) { return }
        verifyUser(channel, userstate.username)
        // ---------------------------------------------
    }

}
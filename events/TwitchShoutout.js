var soBuffer = new Map();
const Modules = require('../index')
const TwitchClient = Modules.TwitchClient
const Helix = Modules.Helix
const { TTV_ModID } = require('../config.json');

module.exports = {
    name: 'TwitchShoutout',
    once: false,
    async execute(reason, channel, username) {
        soBuffer.set(username, channel) // add user to soBuffer
        console.log(`Added ${username} to the soBuffer, shouting out soon! Reason: ${reason}`);
    }
}
function soBuffered() {
    let u = soBuffer.keys().next().value // next user in soBuffer
    let c = soBuffer.values().next().value // associated channel
    if (u) { // if anything is in the soBuffer, do:
        doShoutouts(c, u) // call shoutout function
        soBuffer.delete(u) // delete after shoutout
    }
}
async function getIDByName(user) {
    const result = await Helix.users.get(user);
    return result.data[0].id
}
async function doShoutouts(channel, user) {
    TwitchClient.say(channel, `!so ${user}`) // use Nightbot command

    //channel = channel.slice(1)
    // let from_broadcaster_user_id = String(await getIDByName(channel))
    // let to_broadcaster_user_id = String(await getIDByName(user))
    // await Helix.chat.shoutout(from_broadcaster_user_id, to_broadcaster_user_id, TTV_ModID)

    // missing from_broadcaster_id ???
}
setInterval(soBuffered, 6000) // Call soBuffered() every 6s, indefinitely
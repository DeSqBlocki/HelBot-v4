var buffer = new Map();
const Modules = require('../index')
const TwitchClient = Modules.TwitchClient
const Helix = Modules.Helix
const { TTV_ModID } = require('../config.json');

module.exports = {
    name: 'TwitchShoutout',
    once: false,
    async execute(reason, channel, username) {
        buffer.set(username, channel) // add user to buffer
        console.log(`Added ${username} to the buffer, shouting out soon! Reason: ${reason}`);
    }
}
function buffered() {
    let u = buffer.keys().next().value // next user in buffer
    let c = buffer.values().next().value // associated channel
    if (u) { // if anything is in the buffer, do:
        doShoutouts(c, u) // call shoutout function
        buffer.delete(u) // delete after shoutout
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
setInterval(buffered, 6000) // Call buffered() every 6s, indefinitely
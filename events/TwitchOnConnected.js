const { TTV_ModID } = require('../config.json')
const Modules = require('../index')
const DiscordClient = Modules.DiscordClient
const Helix = Modules.Helix
module.exports = {
    name: 'TwitchOnConnected',
    once: false,
    async execute(address, port) {
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
        async function doEventSub(){
            const options = { // Optional. Configuration of connection
                debug: false // Optional. Log all EventSub messages. Default: false
            };
            const EventSubClient = await Helix.EventSub.connect(options);
        
            if(options.debug){
                Helix.EventSub.events.on(Helix.EventSub.WebsocketEvents.CONNECTED, () => {
                    console.log("Connected to EventSub");
                });
                Helix.EventSub.events.on(Helix.EventSub.WebsocketEvents.DISCONNECTED, () => {
                    console.log("Disconnected from EventSub");
                });
            }
            const conditions = [{
                broadcaster_user_id: String(await getIDByName("x__hel__x")) // streamer to sub to
            }]
        
            // Hel Events
            EventSubClient.subscribe(
                "stream.online", conditions[0], stream => {
                    console.log(`${stream.broadcaster_user_login} went online`)
                    DiscordClient.emit('TwitchLive', stream.broadcaster_user_login)
                }
            )
            EventSubClient.subscribe(
                "stream.offline", conditions[0], stream => {
                    console.log(`${stream.broadcaster_user_login} went offline`)
                    updateChatMode(stream.broadcaster_user_id.toString(), "on")
                }
            )
        }
        console.log(`Connected to ${address}:${port}`)
        doEventSub()
    }
}
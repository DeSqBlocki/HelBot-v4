const { liveID, guildID, roleID } = require('../config.json')
const { EmbedBuilder } = require('discord.js')
const Modules = require('../index')
const DiscordClient = Modules.DiscordClient
const Helix = Modules.Helix
module.exports = {
    name: 'TwitchLive',
    once: false,
    async execute(streamer) {
        async function notifyChannel(roleID, guildID, channelID, streamer) {
            let guild = DiscordClient.guilds.cache.get(guildID)
            let channel = guild.channels.cache.get(channelID)
            await createEmbed(streamer)
                .then(returnedEmbed => {
                    channel.send({
                        content: `<@&${roleID}> im live <:comfAlt:1052913776049012736> <a:sparkles:963229266991001630>`,
                        embeds: [returnedEmbed]
                    })
                })
                .catch(err => console.log(err))
        }
        async function createEmbed(channel) {
            const streamdata = await getStreamData(channel)
            const imageUrl = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel.toLowerCase()}.jpg`
            const embed = new EmbedBuilder()
                .setTitle(`Stream Notice!`)
                .setURL(`https://twitch.tv/${channel}`)
                .setDescription(`*${streamdata.title}*\nThey're playing **${streamdata.game_name}**`)
                //.setTimestamp()
                //.setFooter({ text: 'HelBot by DeSqBlocki', iconURL: 'https://media.discordapp.net/attachments/1133053688064262234/1156841130349051975/HelBot.png' })
                .setImage(imageUrl)
            return embed
        }
        async function getStreamData(channel) {
            let channelID = await getIDByName(channel)
            let result = await Helix.channel.get((channelID))
            return result.data[0]
        }
        async function getIDByName(user) {
            const result = await Helix.users.get(user);
            return result.data[0].id
        }
        // notifyChannel(roleID, guildID, liveID, streamer) // Turned off for now
    }
}
const { SlashCommandBuilder, Events } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('simshoutout')
        .setDescription('simulates a shoutout event'),
    async execute(interaction) {
        if(!interaction.member.permissions.has("ADMINISTRATOR")){ 
            return await interaction.reply({
                content: "Unprivileged Access!",
                ephemeral: true
            })
        }
        
        interaction.client.emit("TwitchShoutout", "TEST", "#desq_blocki", "desq_blocki")
        await interaction.reply({
            content: "Done!",
            ephemeral: true
        })
        
    }
}
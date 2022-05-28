const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { MessageButton, MessageActionRow } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder().setName("menu").setDescription("Displays menu"),
	run: async ({ client, interaction }) => {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton().setStyle('PRIMARY').setLabel('Loop? 🔂').setCustomId('Play_Loop'),
                new MessageButton().setStyle('PRIMARY').setLabel('Unloop? 🔁').setCustomId('Play_Unloop'),
                new MessageButton().setStyle('PRIMARY').setLabel('Shuffle? 🔀').setCustomId('Play_Shuffle'),
                new MessageButton().setStyle('PRIMARY').setLabel('Skip? ⏭️').setCustomId('Play_Skip'),
                new MessageButton().setStyle('PRIMARY').setLabel('Info? ⏺️').setCustomId('Play_Info'),
            )
        await interaction.editReply({
        components: [row],
        })

	},
}
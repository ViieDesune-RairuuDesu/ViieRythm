const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType, QueueRepeatMode } = require("discord-player")
const { MessageButton, MessageActionRow } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play some songs woo")
        .addStringOption((option) =>
        option.setName("searchterms").setDescription("Song to search").setRequired(true)
        ),

	run: async ({ client, interaction }) => {
        try{		
            if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a VC to use this command")

            const queue = await client.player.createQueue(interaction.guild)
            if (!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed = new MessageEmbed()

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton().setStyle('PRIMARY').setLabel('Loop? 🔂').setCustomId('Play_Loop'),
                    new MessageButton().setStyle('PRIMARY').setLabel('Unloop? 🔁').setCustomId('Play_Unloop'),
                    new MessageButton().setStyle('PRIMARY').setLabel('Shuffle? 🔀').setCustomId('Play_Shuffle'),
                    new MessageButton().setStyle('PRIMARY').setLabel('Skip? ⏭️').setCustomId('Play_Skip'),
                    new MessageButton().setStyle('PRIMARY').setLabel('Info? ⏺️').setCustomId('Play_Info'),
                )

            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})
            
            if (!queue.playing) await queue.play()
            await interaction.editReply({
                embeds: [embed],
                components: [row],
            })
        } catch(err){await interaction.editReply('Sorry, there was an error! Maybe the searchterms you provided were invalid?')}
	},
}

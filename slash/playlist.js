const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType, QueueRepeatMode } = require("discord-player")
const { MessageButton, MessageActionRow } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("playlist")
		.setDescription("Play a playlist woo")
        .addStringOption((option) =>
        option.setName("url").setDescription("Playlist to search").setRequired(true)
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
            )

            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            if(playlist.title){
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                .setThumbnail(playlist.thumbnail)
            }
            else {
                embed
                .setDescription(`**${result.tracks.length} songs from **${playlist.url}** have been added to the Queue`)
                .setThumbnail(playlist.thumbnail)

                console.log(`${url} has no title!`)
            }
            
            if (!queue.playing) await queue.play()
            await interaction.editReply({
                embeds: [embed],
                components: [row],
            })
        } catch(err){await interaction.editReply('Sorry, there was an error! Maybe the searchterms you provided were invalid?')}
	},
}

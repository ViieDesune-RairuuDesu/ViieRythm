const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType, QueueRepeatMode } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("playlist")
		.setDescription("Play a playlist woo")
        .addStringOption((option) =>
        option.setName("url").setDescription("Playlist to search").setRequired(true)
        ),

	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a VC to use this command")

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new MessageEmbed()

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
            embeds: [embed]
        })
	},
}

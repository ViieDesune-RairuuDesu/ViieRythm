const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles the queue"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

		queue.shuffle()
		
		let embed = new MessageEmbed()

		embed
		.setDescription(`**🔀Shuffled Queue🔀 \n Playing Now:**\n` + 
			(currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
			`\n\n**Queue**\n${queueString}`
			)
		.setThumbnail(currentSong.setThumbnail)

		await i.reply({ embeds: [embed], components: [] });    
	},
}

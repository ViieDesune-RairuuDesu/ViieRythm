const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("info").setDescription("Displays info about the currently playing song"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)
		const track = client.player.track;

		if (!queue) return await interaction.editReply({content: "There are no songs in the queue", ephemeral: true})

		let bar = queue.createProgressBar({
			queue: false,
			length: 30,
			line: '=',
			indicator: '◉',
		})

        const song = queue.current
		const ts = queue.getPlayerTimestamp();

		await interaction.editReply({
			embeds: [new MessageEmbed()
            .setThumbnail(song.thumbnail)
            .setDescription(`<a:musicGIF:934584884696068176> Currently Playing: [${song.title}](${song.url}) || By: ${song.author} <a:musicGIF:934584884696068176>\n\n<a:clock:979661388890902528>Time: ${ts.current} / ${ts.end}<a:clock:979661388890902528> \n\n` + bar)
			],
			ephemeral: true,
		})
	},
}

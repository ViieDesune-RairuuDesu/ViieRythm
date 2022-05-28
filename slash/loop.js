const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueueRepeatMode } = require("discord-player")


module.exports = {
    data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loops current song!")
    .addSubcommand((subcommand) =>
    subcommand
        .setName("start")
        .setDescription("Loops current song")
    )
    .addSubcommand((subcommand) =>
    subcommand
        .setName("stop")
        .setDescription("Stops looping")
    ),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

		let embed = new MessageEmbed()


        if (interaction.options.getSubcommand() === "start") {
            if (!queue) return await interaction.editReply("There are no songs in the queue!")

            queue.setRepeatMode(QueueRepeatMode.TRACK);
            const song = queue.current;
            embed
            .setDescription(`🔂**[${song.title}](${song.url})** has been looped!🔂`)
            .setThumbnail(song.thumbnail)
        } else if (interaction.options.getSubcommand() === "stop") {
            if (!queue) return await interaction.editReply("There are no songs in the queue!")

            queue.setRepeatMode(QueueRepeatMode.OFF);
            const song = queue.current;
            embed
            .setDescription(`🔁Looping **[${song.title}](${song.url})** has been stopped!🔁`)
            .setThumbnail(song.thumbnail)
        }


        await interaction.editReply({
            embeds: [embed]
        })
    },
}
const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType, QueueRepeatMode } = require("discord-player")
const { MessageButton, MessageActionRow } = require('discord.js')
const lyricsFinder = require('lyrics-finder');
const Genius = require("genius-lyrics");
const GClient = new Genius.Client()
const youtube = require('scrape-youtube');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("Get song lyrics!")
        .addStringOption((option) =>
        option.setName("song").setDescription("Song lyrics to search").setRequired(false)
        ),

	run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        let song
        try{ song = queue.current } catch(err){}
        let res
        let embed = new MessageEmbed()
        let lyr = interaction.options.getString("song")
        let content

        let search

        if(!lyr && song != ""){
            try { search = song.title } catch(err){}
        }
            // console.log("1")
        else if(!lyr && song == "")
            await interaction.editReply("There isn't any song playing!")
            // console.log("2")
        else if(lyr)
            search = lyr
            // console.log("3")
        else    
            await interaction.editReply("Error searching for song!")
            // console.log("4")

        try{

        const searches = await GClient.songs.search(search);

        // Pick first one
        const firstSong = searches[0];
        // console.log("About the Song:\n", firstSong, "\n");
            
        // Ok lets get the lyrics
        content = await firstSong.lyrics();
        // console.log("Lyrics of the Song:\n", content, "\n");

            embed
            .setDescription(`**[${firstSong.title}](${firstSong.url})**\n\n` + content)
            .setThumbnail(firstSong.thumbnail)

            await interaction.editReply({
                embeds: [embed],
            })
        }catch(err){await interaction.editReply("No such song found in Genius Lyrics, sorry!")}
	},
}
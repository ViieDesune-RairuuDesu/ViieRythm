const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v10")
const fs = require("fs")
const { Player } = require("discord-player")
const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueueRepeatMode } = require("discord-player")
const { MessageButton, MessageActionRow } = require('discord.js')

dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "945583047800152064"
//const GUILD_ID = "887526297230778408" //Lackeys
const GUILD_ID = "979550861019738132" //Test
const guilds = ["887526297230778408", "979550861019738132"]


const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_VOICE_STATES"
    ]
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let commands = []


//================================================
//Button Listener
client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;

    const i = interaction;

    const slashcmd = client.slashcommands.get(interaction.commandName)

    const queue = client.player.getQueue(interaction.guildId)

    let embed = new MessageEmbed()


    if (i.customId === 'Play_Loop') {
        if (!queue) return await i.reply("There are no songs in the queue")

        queue.setRepeatMode(QueueRepeatMode.TRACK);
        const song = queue.current;
        embed
            .setDescription(`🔂**[${song.title}](${song.url})** has been looped!🔂`)
            .setThumbnail(song.thumbnail)

        await i.reply({ embeds: [embed], components: [] });    
	}

    else if (i.customId === 'Play_Unloop') {
        if (!queue) return await i.reply("There are no songs in the queue")

        queue.setRepeatMode(QueueRepeatMode.OFF);
        const song = queue.current;
        embed
            .setDescription(`🔁Looping **[${song.title}](${song.url})** has been stopped!🔁`)
            .setThumbnail(song.thumbnail)

        await i.reply({ embeds: [embed], components: [] });    
	}

    else if (i.customId === 'Play_Shuffle') {
        if (!queue) return await i.reply("There are no songs in the queue!")

		queue.shuffle()

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        
        const queueString = queue.tracks.slice(1 * 10, 1 * 10 + 10).map((song, i) => {
            return `**${1 * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        embed
            .setDescription(`**🔀Shuffled Queue🔀 \n Playing Now:**\n` + 
                (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                `\n\n**Queue**\n${queueString}`
                )
            .setThumbnail(currentSong.setThumbnail)

        await i.reply({ embeds: [embed], components: [] });    
	}

    else if (i.customId === 'Play_Info') {
        const track = client.player.track;

		if (!queue) return await i.reply({content: "There are no songs in the queue", ephemeral: true})

		let bar = queue.createProgressBar({
			queue: false,
			length: 30,
			line: '=',
			indicator: '◉',
		})

        const song = queue.current
		const ts = queue.getPlayerTimestamp();

		await i.reply({
			embeds: [new MessageEmbed()
            .setThumbnail(song.thumbnail)
            .setDescription(`<a:musicGIF:934584884696068176> Currently Playing: [${song.title}](${song.url}) || By: ${song.author} <a:musicGIF:934584884696068176>\n\n<a:clock:979661388890902528>Time: ${ts.current} / ${ts.end}<a:clock:979661388890902528> \n\n` + bar)
			],
		})
	}

    else if (i.customId === 'Play_Loop') {
        
	}

    else if (i.customId === 'Play_Loop') {
        
	}
});
//================================================

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    client.login(TOKEN)
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    guilds.forEach(guild => {
        rest.put(Routes.applicationGuildCommands(CLIENT_ID, guild.id), {body: commands})
        .then(() => {
            console.log(`Successfully loaded to ${guild.name}!`)
            process.exit(0)
        })
        .catch((err) => {
            if (err){
                console.log(err)
                process.exit(1)
            }
        })
    })
}
else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    client.login(TOKEN)

    client.on("guildCreate", (guild) => {
        // This event triggers when the bot joins a guild.  
        //Basically just use the load_slash code everytime bot joins new guild.  
        console.log(`Joined new guild: ${guild.name}`);

        const ID = guild.id;

        const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
        for (const file of slashFiles){
            const slashcmd = require(`./slash/${file}`)
            client.slashcommands.set(slashcmd.data.name, slashcmd)
            commands.push(slashcmd.data.toJSON())
        }

        const rest = new REST({ version: "9" }).setToken(TOKEN)
        console.log("Deploying slash commands")
        rest.put(Routes.applicationGuildCommands(CLIENT_ID, ID), {body: commands})
        .then(() => {
            console.log(`Successfully loaded commands to ${guild.name}!`)
        })
        .catch((err) => {
            if (err){
                console.log(err)
                process.exit(1)
            }
        })
    });
}

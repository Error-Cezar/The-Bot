const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, GuildAuditLogs } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setsetting')
		.setDescription('Send a message to a specified user')
		.addStringOption(option =>
			option.setName('setting')
				.setDescription('Setting to change')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('parameter')
				.setDescription('Parameter to set')
				.setRequired(true)),
	Permissions: Permissions.FLAGS.MANAGE_GUILD,

	async execute(interaction) {
		const client = interaction.client
		const guildConf = await client.getGuild(interaction.guild);
		//console.log(typeof guildConf)
        if(guildConf == "NoGuild") {
			let embed = await client.ErrorEmbed(`No guild configuration found.. Please wait a few seconds and run the command again.`);
			interaction.reply({ embeds: [embed] });
			interaction.client.emit('guildCreate', interaction.guild);
			return;
		}

		function Writable(prop) { if(prop == "GuildName" || prop == "GuildID" || prop == "_v" || prop == "_id" || prop == "Muted") return false; else return true; }

		const { Guild } = require(`${process.cwd()}/Models/index.js`);
		const prop  = interaction.options.getString('setting');
		let value = interaction.options.getString('parameter');
		let paths = [];
		Guild.schema.eachPath(function(path) {
			paths.push(path)
		})
		console.log("[PROP] =>", prop)
		console.log("[INCLUDES] =>", paths.includes(prop))
		console.log("[GUILD CONFIG] =>", paths)
        if(!paths.includes(prop) || Writable(prop) == false) {
		let configProps = Object.keys(guildConf).map(prop => {
			for (var key in guildConf) {
				if (guildConf.hasOwnProperty(key)) {
				   
				}
			  }
			});
            return interaction.reply(`Invalid setting.`);
          }


		  let id
		  let xd
      switch(prop) {
		case("WelcomeChannel"):
		//if(!value.includes("<#") || value.includes(">")) { interaction.reply("You need to set a valid channel."); return}
		console.log("hi")
		id = value.replaceAll("<#", "")
		id = value.replaceAll(">", "")
		id = id.slice(2);
		console.log(id)

		xd = interaction.guild.channels.cache.find(channel => channel.id === id)
		if(!xd) { interaction.reply("Invalid channel"); return }
		if(xd.type === 'GUILD_VOICE') { interaction.reply("Invalid channel"); return}
		await client.updateGuild(interaction.guild, prop, id);
		value = `#${xd.name}`
	  break;

	  case("ConfessChannel"):
	  //if(!value.includes("<#") || value.includes(">")) { interaction.reply("You need to set a valid channel."); return}
	  console.log("hi")
	  id = value.replaceAll("<#", "")
	  id = value.replaceAll(">", "")
	  id = id.slice(2);
	  console.log(id)

	  xd = interaction.guild.channels.cache.find(channel => channel.id === id)
	  if(!xd) { interaction.reply("Invalid channel"); return }
	  if(xd.type === 'GUILD_VOICE') { interaction.reply("Invalid channel"); return}
	  await client.updateGuild(interaction.guild, prop, id);
	  value = `#${xd.name}`
	break;

		  default:
			await client.updateGuild(interaction.guild, prop, value);
	  }
      
          // We can confirm everything's done to the client.
          interaction.reply(`Server setting ${prop} has been changed to:\n\`${value}\``);
      
		
	},
};

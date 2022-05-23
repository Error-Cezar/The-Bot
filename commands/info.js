const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { dependencies } = require(`${process.cwd()}/package.json`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('The Infos'),

	async execute(interaction) {
        const client = interaction.client
        const hou = (client.uptime/3,6e+6)
        const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('The Infos')
        .setDescription("You want info I give")
        .addFields(
            { name: 'Current Discordjs Version', value: `${dependencies["discord.js"]}` },
            { name: 'Current Bot Version', value: `${require(`${process.cwd()}/package.json`).version}` },
            { name: '\u200B', value: '\u200B' },
            { name: 'Commands', value: `${interaction.client.commands.size}`, inline: true },
            )
        .setTimestamp()
        .setFooter({ text: "Basically it's quite a big deal"});
    
    interaction.reply({ embeds: [exampleEmbed] });
      
		
	},
};

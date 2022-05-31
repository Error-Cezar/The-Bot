const { SlashCommandBuilder } = require('@discordjs/builders');
const { APIVersion } = require('discord-api-types/v10');
const { Permissions, MessageEmbed } = require('discord.js');
const { dependencies } = require(`${process.cwd()}/package.json`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('pong'),
    Permissions: "none",

	async execute(interaction) {
        function delay(delayInms) {  return new Promise(resolve => { setTimeout(() => { resolve(2); }, delayInms); }); }
        const client = interaction.client
        await interaction.reply(`<@973587985268359178>`);
        const apiPing = Math.round(client.ws["ping"])
        let apiPingRating = "LOW"
    
        if (apiPing > 1000) {
            apiPingRating = "VERY HIGH";
        } else if (apiPing > 500) {
            apiPingRating = "HIGH";
        } else if (apiPing > 300) {
            apiPingRating = "MEDIUM";
        }
        
    delay(apiPing)
		await interaction.followUp(`**Who pinged the hell pinged me**\nCurrent API ping is \`\`${apiPing}ms\`\`\nNot gonna lie that ping do be ${apiPingRating}`);
      
		
	},
};

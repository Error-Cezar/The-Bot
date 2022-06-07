const { SlashCommandBuilder } = require('@discordjs/builders');
const { APIVersion } = require('discord-api-types/v10');
const { Permissions, MessageEmbed } = require('discord.js');
const { dependencies } = require(`${process.cwd()}/package.json`)

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('mute a user from the server.')
        .addUserOption(option =>
			option.setName('member')
				.setDescription('Specified user')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Message to send')),
    Permissions: Permissions.FLAGS.MANAGE_MESSAGES,

	async execute(interaction) {
        if(!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
			await interaction.reply("I don't have enough permissions to execute that command !")
			return
		}
        function delay(delayInms) {  return new Promise(resolve => { setTimeout(() => { resolve(2); }, delayInms); }); }

        let muted = await interaction.guild.roles.cache.find(x => x.name === "Server Muted");
        
        if(!muted) {
            await interaction.guild.roles.create({ name: 'Server Muted'});
            muted = await interaction.guild.roles.cache.find(x => x.name === "Server Muted");
            interaction.guild.channels.cache.forEach((channel) => {
                if (channel.type === 'GUILD_VOICE') {
                    channel.permissionOverwrites.create(muted, { CONNECT: false });
                } else {
                    channel.permissionOverwrites.create(muted, { SEND_MESSAGES: false });
                }
            });
        }

        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || "None."

        if (member.roles.cache.some(role => role.name === 'Server Muted')) { interaction.reply("User is already muted."); return }

        member.roles.add(muted)

        const guildConf = await interaction.client.getGuild(interaction.guild);
        let mute = guildConf.Muted;
        console.log(mute)
        let MuteObject = {
            UserID: member.id,
            Username: member.username,
            reason: reason,
            duration: "none"
        }
        mute.push(MuteObject);

        console.log(mute)

        await interaction.client.updateGuild(interaction.guild, "Muted", mute);

        interaction.reply(`<@${member.id}> has been muted with reason: ${reason}`)
        
		
	},
};

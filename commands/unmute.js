const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('unmute a user from the server.')
        .addUserOption(option =>
			option.setName('member')
				.setDescription('Specified user')
				.setRequired(true)),
    Permissions: Permissions.FLAGS.MANAGE_MESSAGES,

	async execute(interaction) {
        if(!interaction.guild.me.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
			await interaction.reply("I don't have enough permissions to execute that command !")
			return
		}
        function removeA(arr) {
            var what, a = arguments, L = a.length, ax;
            while (L > 1 && arr.length) {
                what = a[--L];
                while ((ax= arr.indexOf(what)) !== -1) {
                    arr.splice(ax, 1);
                }
            }
            return arr;
        }

        function delay(delayInms) {  return new Promise(resolve => { setTimeout(() => { resolve(2); }, delayInms); }); }

        let muted = await interaction.guild.roles.cache.find(x => x.name === "Server Muted");
        
        if(!muted) {
        interaction.reply({ content: 'No mute role has been set!\n Please run the mute command to setup the role.', ephemeral: true })
        }

        const member = interaction.options.getMember('member');

        if(!member.manageable) { interaction.reply("Cannot remove muted role from this member!"); return }

        if (member.roles.cache.some(role => role.name === 'Server Muted')) {
            member.roles.remove(muted);        
            const guildConf = await interaction.client.getGuild(interaction.guild);
            let mute = guildConf.Muted;
            const indexOfObject = mute.findIndex(object => {
                return object.UserID === member.id;
            });
            mute.splice(indexOfObject, 1);
            await interaction.client.updateGuild(interaction.guild, "Muted", mute);
            interaction.reply(`<@${member.id}> has been unmuted.`) } else { interaction.reply("This user isn't muted.")}
		
	},
};

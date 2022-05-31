const bitfieldCalculator = require('discord-bitfield-calculator');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
    
        if (!command) return;

       // console.log(`${interaction.user.tag} used ${interaction.commandName} in ${interaction.channel.name}.`);

        try {
            console.log(command.Permissions)
            if(command.Permissions !== "none") {
                if(!interaction.member.permissions.has(command.Permissions)) {
                    const perm = command.Permissions.toString().replace(/\D/g,'');
                    const myPerms = bitfieldCalculator.permissions(perm);
                    await interaction.reply(`You need the \`\`${myPerms[0]}\`\` permission.`)
                    return
                }
            }
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
	},
};
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { insertMany } = require('../Models/Server');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confess')
		.setDescription('Useless feature to do a anomynous confess'),
    Permissions: "none",

	async execute(interaction) {
    let candm = true
        const msg = await interaction.user.send("Insert the message to send. (only one message can be sent)").catch((error) => {
            interaction.reply("I couldn't dm you.")
            candm = false
            return
        });
      if(candm == false) return
      const guildConf = await interaction.client.getGuild(interaction.guild);
      if(guildConf.ConfessChannel == "none") { interaction.reply({ content: "The confess channel hasn't been set!", ephemeral: true }); return}
      await interaction.reply({ content: 'Check your dms!', ephemeral: true });
      const filter = collected => collected.author.id === interaction.user.id;

        const collector = msg.channel.createMessageCollector({filter, max: 1, time: 30000}); //We're creating the collector, allowing for a max of 5 messages or 30 seconds runtime.
        collector.on('collect', collected => { //Triggered when the collector is receiving a new message
            if(collected.content === 'cancel') interaction.user.send('Canceled'); return
        })

        collector.on('end', async (collected, reason) => { //Triggered when the collector ends. collected is a <Collection> of all messages collected and reason is the reason the collector ended.
          if(reason == "limit") {
              console.log(collected)
              if(collected.first().content == "cancel") return
              if(collected.first().content.length > 4085) { msg.channel.send("Message cannot be longer than 4086 characters."); return }
              try {
                  const emb = await interaction.client.Embed("New Confession", collected.first().content)
                  const xd = interaction.guild.channels.cache.find(channel => channel.id === guildConf.ConfessChannel)
		          if(xd == undefined) return
		          xd.send({embeds: [emb]})
                  msg.channel.send("Message has been successfully sent")
              }catch(err) {
                  msg.channel.send(`An error occured.\n${err.message}`)
              }
          } else { msg.channel.send("Collector timed out! cancelling..."); return }
        })

    

    },
};

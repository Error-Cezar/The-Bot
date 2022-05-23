const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { insertMany } = require('../Models/Server');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confess')
		.setDescription('Useless feature to do a anomynous confess'),

	async execute(interaction) {
    let candm = true
        const msg = await interaction.user.send("Insert the message to send. (only one message can be sent)").catch((error) => {
            interaction.reply("I couldn't dm you.")
            candm = false
            return
        });
      if(candm == false) return

      const filter = collected => collected.author.id === interaction.user.id;

        const collector = msg.channel.createMessageCollector({filter, max: 1, time: 30000}); //We're creating the collector, allowing for a max of 5 messages or 30 seconds runtime.
        
        collector.on('collect', collected => { //Triggered when the collector is receiving a new message
            if(collected.content === 'cancel') interaction.user.send('Canceled'); return
        })

        collector.on('end', (collected, reason) => { //Triggered when the collector ends. collected is a <Collection> of all messages collected and reason is the reason the collector ended.
          if(reason == "limit") {
              if(collected.content == "cancel") return
              if(collected.content.length > 4085) { msg.channel.send("Message cannot be longer than 4086 characters."); return }
              try {
              msg.channel.send("Message has been successfully sent")
              }catch(err) {
                  msg.channel.send(`An error occured.\n${err.message}`)
              }
          } else { msg.channel.send("Collector timed out! cancelling..."); return }
        })

    

    },
};

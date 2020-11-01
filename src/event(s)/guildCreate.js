const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
var Guild = require('../schema(s)/guild');
const join = require('../utils/emojis.json')
const config = require('../../config.json')

module.exports = async (client, guild) => {

    client.logger.info(`${client.user} joined ${guild.name}`);
  const serverLog = client.channels.cache.get(client.logID);
  if (serverLog)
    serverLog.send(new MessageEmbed().setDescription(`${join} ${client.user} has joined \`${guild.name}\``));

    let muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
  if (!muteRole) {
    try {
      muteRole = await guild.roles.create({
        data: {
          name: 'Muted',
          permissions: []
        }
      });
    } catch (err) {
      client.logger.error(err.message);
    }
    for (const channel of guild.channels.cache.values()) {
      try {
        if (channel.viewable && channel.permissionsFor(guild.me).has('MANAGE_ROLES')) {
          if (channel.type === 'text')
            await channel.updateOverwrite(muteRole, {
              'SEND_MESSAGES': false,
              'ADD_REACTIONS': false
            });
          else if (channel.type === 'voice' && channel.editable)
            await channel.updateOverwrite(muteRole, {
              'SPEAK': false,
              'STREAM': false
            });
        } 
      } catch (err) {
        client.logger.error(err.stack);
      }
    }
  }

    guild = new Guild({
        guildID: guild.id,
        prefix: config.prefix,
        muteroleid: muteRole.id,
    });

    guild.save()
    .then(result => console.log(result))
    .catch(err => console.error(err));

};
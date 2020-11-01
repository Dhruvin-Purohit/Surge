const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const User = require('../../schema(s)/user');
const fetch = require('node-fetch');
const config = require('../../../config.json');

module.exports = class BsStatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bsstats',
      aliases: ['brawlstarsstats', 'brawlstats', "bs"],
      usage: 'bsstats <player_tag>',
      description: oneLine`
        Sets the prefix for your server.
        Provide no prefix to set the default
      `,
      type: client.types.SETUP,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['bsstats']
    });
  }
  async run(message, args) {

    const token = config.bsapi;
    
    let user = await User.findOne({userID: message.author.id})

    if (args[0]) {

    let tag = args[0]

    const rgx = /^#?[0-9A-Z]/i;

    const failembed = new MessageEmbed()
    .setDescription(`${emojis.Angry} Give a Valid Player Tag`);

    if (!rgx.test(tag)) return message.channel.send(failembed)
    if (tag.startsWith('#')) tag = tag.slice(1);

    try {
        const res = await fetch(`https://api.brawlstars.com/v1/players/%23${tag}`, { headers: {'Authorization': `Bearer ${token}`}});
        const stats = await res.json();
        if (!stats.reason) {

        let color = stats.nameColor.slice(4)
        color = '#' + color

        const embed = new MessageEmbed()
          .setTitle(`${stats.name}'s stats`)
          //.setImage(img)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setDescription(`
          **Tag:** \`${stats.tag}\`
          **Experience Level:** \`${stats.expLevel}\`
          **Current Expereince:** \`${stats.expPoints}\`
          **Current Trophies:** \`${stats.trophies}\`${emojis.Trophy}
          **Highest Trophies:** \`${stats.highestTrophies}\`${emojis.Trophy}
          **Solo Victories:** \`${stats.soloVictories}\`
          **Duo Victories:** \`${stats.duoVictories}\`
          **3vs3 Victories:** \`${stats["3vs3Victories"]}\`
          **Power Play Points:** \`${stats.powerPlayPoints}\`
          **Highest Power Play Points:** \`${stats.highestPowerPlayPoints}\`
          **Brawlers:** \`${stats.brawlers.length}\`
          `)
          .addField(`Club:`, `**Club Name**: \`${stats.club.name}\`\n**Club Tag**: \`${stats.club.tag}\``)
          .setColor(color);

        message.channel.send(embed);
        } else if (stats.reason === 'notFound') {
            const nofind = new MessageEmbed()
            .setDescription(`${emojis.Sad} Give me a valid Player tag`)
            message.channel.send(nofind)
        } else {
            const shit = new MessageEmbed()
            .setDescription(`**Error**: \`${stas.reason}\`\n**Message**: \`${stats.message || 'None'}\``)
            message.channel.send(shit)
        }
      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
      }

    } else if (user.bstag) {

        let tag = user.bstag

    const rgx = /^#?[0-9A-Z]/i;

    const failembed = new MessageEmbed()
    .setDescription(`${emojis.Angry} The player tag linked to your account is incorrect.`);

    if (!rgx.test(tag)) return message.channel.send(failembed)
    if (tag.startsWith('#')) tag = tag.slice(1);

    try {
        const res = await fetch(`https://api.brawlstars.com/v1/players/%23${tag}`, { headers: {'Authorization': `Bearer ${token}`}});
        const stats = await res.json();
        if (!stats.reason) {

        let color = stats.nameColor.slice(4)
        color = '#' + color

        const embed = new MessageEmbed()
          .setTitle(`${stats.name}'s stats`)
          //.setImage(img)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setDescription(`
          **Tag:** \`${stats.tag}\`
          **Experience Level:** \`${stats.expLevel}\`
          **Current Expereince:** \`${stats.expPoints}\`
          **Current Trophies:** \`${stats.trophies}\`${emojis.Trophy}
          **Highest Trophies:** \`${stats.highestTrophies}\`${emojis.Trophy}
          **Solo Victories:** \`${stats.soloVictories}\`
          **Duo Victories:** \`${stats.duoVictories}\`
          **3vs3 Victories:** \`${stats["3vs3Victories"]}\`
          **Power Play Points:** \`${stats.powerPlayPoints}\`
          **Highest Power Play Points:** \`${stats.highestPowerPlayPoints}\`
          **Brawlers:** \`${stats.brawlers.length}\`
          `)
          .addField(`Club:`, `**Club Name**: \`${stats.club.name}\`\n**Club Tag**: \`${stats.club.tag}\``)
          .setColor(color);

        message.channel.send(embed);
        } else if (stats.reason === 'notFound') {
            const nofind = new MessageEmbed()
            .setDescription(`${emojis.Sad} The tag linked to your account is Invalid.`)
            message.channel.send(nofind)
        } else {
            const shit = new MessageEmbed()
            .setDescription(`**Error**: \`${stas.reason}\`\n**Message**: \`${stats.message || 'None'}\``)
        }
      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
      }



    } else {
        const notspecified = new MessageEmbed()
        .setDescription(`${emojis.Angry}Give me a valid Player Tag to search for.\nOr link your player tag to your account.`);

        return message.channel.send(notspecified)
    }
  }
};

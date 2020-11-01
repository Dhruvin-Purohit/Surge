const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const User = require('../../schema(s)/user');

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

    let user = await User.findOne({userID: message.author.id})

    if (args[0]) {

    let tag = args[0]

    const rgx = /^#?[0-9A-Z]/i;

    const failembed = new MessageEmbed()
    .setDescription(`${emojis.Angry} Give a Valid Player Tag`);

    if (!rgx.test(tag)) return message.channel.send(failembed)
    if (tag.startsWith('#')) tag = tag.slice(1);
    } else if (user.bstag) {



    } else {
        const notspecified = new MessageEmbed()
        .setDescription(`${emojis.Angry}Give me a valid Player Tag to search for.\nOr link to your account.`);

        return message.channel.send(notspecified)
    }
  }
};

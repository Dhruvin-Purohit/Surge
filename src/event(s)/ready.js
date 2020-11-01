module.exports = async (client) => {
  
  const activities = [
    { name: 'Brawl Stars', type: 'PLAYING' },
    { name: 'Clash of Clans', type: 'PLAYING' },
    { name: 'Clash Royale', type: 'PLAYING' }
  ];

  // Update presence
  client.user.setPresence({ status: 'afk', activity: activities[0] });

  let activity = 1;

  // Update activity every minute
  setInterval(() => {
    if (activity > 2) activity = 0;
    client.user.setActivity(activities[activity]);
    activity++;
  }, 60000);

  client.logger.info('Call the Surge');
  client.logger.info(`Surge has got ${client.guilds.cache.size} server(s)`);
};

// exports.run = async (client, message, args, level) => {
//   if (!args[0]) {
//     const keywords = client.keywords.sort();
//     let output = '= Keyword List =\n\n';
//     keywords.forEach((k) => {
//       output += `${k}, `;
//     });
//     message.channel.send(output.toProperCase(), { code: 'asciidoc' });
// };

// exports.conf = {
//   enabled: true,
//   guildOnly: true,
//   aliases: ['top10', 'leaderboard', 'rankings', 'lb', 't10'],
//   permLevel: 'User',
//   botPerms: [],
// };

// exports.help = {
//   name: 'ranking',
//   category: 'Feedback',
//   description: 'Displays top 10 ranked users in your guild.',
//   extended: '...',
//   usage: 'ranking',
// };

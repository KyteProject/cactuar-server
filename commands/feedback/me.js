const sql = require('sqlite');

const { MessageEmbed } = require('discord.js');
// const { Canvas } = require('canvas-constructor');
// const { resolve, join } = require('path');
// const { MessageAttachment } = require('discord.js');
// const { get } = require('snekfetch');
// const fsn = require('fs-nextra');

// const imageUrlRegex = /\?size=2048$/g;

// async function profile (member, row) {
//   Canvas.registerFont(resolve(join(__dirname, "../../font/discord.otf")), "Discord");

//   const { body: avatar } = await get(member.user.displayAvatarURL().replace(imageUrlRegex, "?size=128"));
//   const name = member.displayName.length > 20 ? member.displayName.substring(0, 17) + "..." : member.displayName;
//   const image = await fsn.readFile('./image/wah2.jpg');

//   return new Canvas(400, 150)
//   .setColor('#7289DA')
//   .addRect(84, 0, 316, 150)
//   .setColor("#2C2F33")
//   // .addRect(0, 0, 84, 150)
//   // .addRect(169, 26, 231, 46)
//   // .addRect(224, 108, 176, 46)
//   // .setShadowColor("rgba(22, 22, 22, 1)") // This is a nice colour for a shadow.
//   // .setShadowOffsetY(5) // Drop the shadow by 5 pixels.
//   // .setShadowBlur(10) // Blur the shadow by 10.
//   .save()
//   // .addCircle(84, 75, 62)
//   .addRoundImage(image, 20, 16, 128, 128, 64) // x, y,
//   .restore()
//   // .createBeveledClip(20, 138, 128, 32, 5)
//   .setColor("#23272A")
//   // .addRect(20, 138, 128, 32)
//   .restore()
//   .setTextAlign("center")
//   .setTextFont("10pt Discord")
//   .setColor("#FFFFFF")
//   .addText(name, 285, 54)
//   .addText(`Level: ${row.level.toLocaleString()}`, 84, 159)
//   .setTextAlign("left")
//   .addText(`Score: ${row.totalPoints.toLocaleString()}`, 241, 136)
//   .toBuffer();
// }

exports.run = async (client, message, args, level) => {
	await sql
		.get(`SELECT * FROM users WHERE jID = "${message.member.joined}"`)
		.then(async row => {
			if (!row) {
				client.query.insertUser(message.member).then(() => {
					message.reply(
						'User not in database for some reason, a new record has been created. Please run the command again.'
					);
				});
			} else {
				let feedbackStatus;
				if (row.keywordCount >= 5) {
					feedbackStatus = '✅ Able to make a request';
				} else if (row.keywordCount < 5 && row.tokens >= 1) {
					feedbackStatus = '✅ Able to make a request with a token';
				} else {
					feedbackStatus = '❌ Unable to make a request';
				}

				const embed = new MessageEmbed()
					.setAuthor(`${message.member.displayName}'s Feedback Profile`, client.user.avatarURL())
					.setColor('00d919')
					.setThumbnail(message.author.avatarURL())
					.addField(
						'User Stats',
						`Level: ${row.level} Points: ${row.currentPoints}/${row.nextLevel} (${row.totalPoints} total)`,
						true
					)
					.addField(
						'Feedback Stats',
						`Tokens: ${row.tokens} Request Ratio: ${row.timesRequested}:${row.timesGiven}`,
						true
					)
					.addField('Last Request', row.lastRequest, true)
					.addField('Status:', feedbackStatus);
				message.channel.send({ embed });

				// await message.channel.send(new MessageAttachment(await profile(message.member, row), `profile-${message.author.id}.jpg`));
			}
		})
		.catch(error => {
			client.logger.log(error);
			// client.query.createUser().then(() => {
			//   client.query.insertUser(message.member);
		});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	cooldown: 10,
	aliases: [''],
	permLevel: 'User',
	botPerms: [],
};

exports.help = {
	name: 'me',
	category: 'Feedback',
	description: 'Display your feedback profile',
	extended: 'Displays your profile and stats on the current server',
	usage: 'me',
};

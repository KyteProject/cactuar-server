const { MessageEmbed } = require('discord.js');

module.exports = async client => {
	client.feedbackScoring = async message => {
		const regex = /\s+/gi;
		const multipier = client.permlevel(message) >= 5 ? 1.2 : 1;
		message.wordCount = message.argsJoined
			.trim()
			.replace(regex, ' ')
			.split(' ').length;
		message.charCountNoSpace = message.argsJoined.replace(regex, '').length;
		client.countKeywords(message);
		message.score = Math.round(
			(message.wordCount * 0.2 + message.charCountNoSpace / 100 + message.keywordCount * 9) * multipier
		);
		message.tokenGain = message.score >= 200 && message.settings.enableTokens === 1 ? 1 : 0;
		client.logger.log(`Debug: ${message.score}`);
		client.query.feedbackSubmit(client, message);
	};

	client.nextLevel = async (message, level) => {
		const nextLevel = level + 1;
		const pointsToLevel = 1 / 4 * Math.floor(nextLevel - 1 + 300 * Math.pow(2, (nextLevel - 1) / 7));
		message.nextLevel = Math.floor(pointsToLevel);
	};

	client.levelUp = async (message, row) => {
		message.currentPoints = row.currentPoints + message.score;
		message.totalPoints = row.totalPoints + message.score;
		message.tokens = row.tokens + message.tokenGain;
		message.keywordCount += row.keywordCount;
		message.timesGiven = row.timesGiven + 1;

		if (row.keywordCount < 5 && message.keywordCount >= 5) {
			message.reply('you can now request feedback. Yaaay~ 😘');
		}

		if (message.currentPoints >= row.nextLevel) {
			message.currentPoints = 0;
			message.level = row.level + 1;
			client.nextLevel(message, message.level);
			message.nextLevel += row.nextLevel;
			message.channel.send(`${message.author.username} just reached level ${message.level}! 🎵`);
		} else {
			message.level = row.level;
			message.nextLevel = row.nextLevel;
		}
	};

	client.countKeywords = async message => {
		message.keywordCount = 0;
		for (let i = 0; i < client.keywords.length; i++) {
			if (message.argsJoined.includes(client.keywords[i])) {
				message.keywordCount++;
			}
		}
	};

	client.checkFeedback = async message => {
		for (let i = 0; i < client.urls.length; i++) {
			if (message.cleanContent.includes(client.urls[i])) {
				return true;
			}
		}
	};

	client.feedbackPermission = async (message, row) => {
		message.tokens = row.tokens;

		if (row.keywordCount < 5 && row.tokens === 0) {
			if (message.settings.deleteSwitch) message.delete();
			if (message.settings.botLogEnable) client.feedbackMsg(message, row);
			client.logger.log(`[Sys] Feedback denied for: ${message.author.username}`);
		} else if (row.keywordCount < 5 && row.tokens > 0) {
			if (message.settings.enableTokens === 1) {
				if (message.settings.pinMessage) {
					try {
						const match = /([0-9]{17,20})/.exec(message.settings.messageID);
						if (!match) throw 'Invalid message id.';
						const id = match[1];
						const oldMsg = await message.channel.messages.fetch(id);
						if (oldMsg.cleanContent !== undefined) {
							oldMsg.unpin();
							message.pin();
						}
					} catch (error) {
						message.pin();
						client.logger.log(error, 'error');
					}
				}
			}
			message.timesRequested = row.timesRequested + 1;
			message.tokens = row.tokens - 1;
			client.query.updateUser(client, message, 'request');
			message.react(message.heartArray.random());
		} else {
			if (message.settings.pinMessage) {
				try {
					const match = /([0-9]{17,20})/.exec(message.settings.messageID);
					if (!match) throw 'Invalid message id.';
					const id = match[1];
					const oldMsg = await message.channel.messages.fetch(id);
					if (oldMsg.cleanContent !== undefined) {
						oldMsg.unpin();
						message.pin();
					}
				} catch (error) {
					message.pin();
					client.logger.log(error, 'error');
				}
			}
			message.timesRequested = row.timesRequested + 1;
			client.query.updateUser(client, message, 'request');
			message.react(message.heartArray.random());
		}
	};

	client.feedbackMsg = async (message, row, type) => {
		try {
			const match = /([0-9]{17,20})/.exec(message.settings.messageID);
			if (!match) throw 'Invalid message id.';
			const id = match[1];
			const oldMsg = await message.channel.messages.fetch(id);
			if (oldMsg.cleanContent !== undefined) {
				const embed = new MessageEmbed()
					.setAuthor('Feedback Auto Moderation', client.user.avatarURL(), 'http://lodestonemusic.com')
					.setColor('00d919')
					.setTimestamp(oldMsg.createdAt)
					.setThumbnail(oldMsg.author.avatarURL())
					.addField('Feedback Denied!!', message.settings.response)
					// .addField('Last Request', oldMsg.cleanContent)
					.addField('About', `Type ${message.settings.prefix}help for info`, true)
					.setFooter(oldMsg.author.username, oldMsg.author.avatarURL())
					.setURL(oldMsg.embeds[0].url);

				const oldEmbed = oldMsg.embeds[0];
				// oldEmbed
				// .setAuthor('Feedback Auto Moderation', client.user.avatarURL(), 'http://lodestonemusic.com')
				// .setColor('00d919');
				// .setTimestamp(oldMsg.createdAt);
				// .setThumbnail(oldMsg.author.avatarURL())
				// .setFooter(oldMsg.author.username, oldMsg.author.avatarURL());

				if (type === 'command') embed.fields.splice(0, 1);
				message.reply(
					'https://soundcloud.com/lodestonemusic/lodestone-return-of-the-dj-mix-2016-free-download'
				);
			}
		} catch (error) {
			client.logger.log(error, 'error');
			message.reply('Feedback has been denied - Error: Previous request message cannot be found.');
		}
	};
};

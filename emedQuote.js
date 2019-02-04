module.exports = () => {
    embed = {
        "title": "Feedback Denied biiiiiiiiiiittch! Wubba-lubba-dub-dub!",
        "description": argv.response,
        "color": 15946079,
        "timestamp": new Date(message.createdTimestamp).toISOString(),
        "footer": {
            "icon_url": message.author.avatarURL,
            "text": '©' + message.author.username
        },
        "thumbnail": {
            "url": bot.user.avatarURL
        },
        "author": {
            "name": bot.user.username,
            "icon_url": bot.user.avatarURL
        },
        "fields": [
            {
                "name": "The last feedback requested was: ",
                "value": message.content
            },
        ]
    };
    return embed;
};
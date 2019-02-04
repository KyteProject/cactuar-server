const config = require('./config');

module.exports = (msg, bot) => {
    return {embed: {
        "title": "Feedback Bot Commands",
        "description": "This is a list of all commands and their usage.  The current command prefix is: " + config.CMDPREFIX,
        "color": 15946079,
        "timestamp": new Date(msg.createdTimestamp).toISOString(),
        "footer": {
            "icon_url": msg.author.avatarURL,
            "text": '©' + msg.author.username
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
                "name": config.CMDPREFIX + "help",
                "value": "Public command - Displays information on the bot."
            },
            {
                "name": config.CMDPREFIX + "rick",
                "value": "Public command - Rick will say a random quote."
            },
            {
                "name": config.CMDPREFIX + "last",
                "value": "Public command - Displays the last feedback track"
            },
            {
                "name": config.CMDPREFIX + "commands",
                "value": "Admin command - Displays this command message!"
            },
            {
                "name": config.CMDPREFIX + "addanswer 'keyword'",
                "value": "Admin command - This will add a keyword to the checkfile for feedback answers.  reloads DB after execution."
            },
            {
                "name": config.CMDPREFIX + "addquestion 'keyword'",
                "value": "Admin command - This will add a keyword to the checkfile for feedback requests.  reloads DB after execution."
            },
            {
                "name": config.CMDPREFIX + "setresponse 'response message'",
                "value": "Admin command - This will change the default response message for when feedback check fails."
            },
            {
                "name": config.CMDPREFIX + "deletemsg",
                "value": "Admin command - This switch toggle the bots auto moderation of messages on or off.  Default is: on."
            },
            {
                "name": config.CMDPREFIX + "count",
                "value": "Admin command - Will display the answer count for user who executes it."
            },
            {
                "name": config.CMDPREFIX + "botstat",
                "value": "Admin command - This command will display the connection statistics of the bot."
            },
            {
                "name": config.CMDPREFIX + "say 'message'",
                "value": "Admin command - This command will make Rick say whatever argument is passed through the command."
            },
            {
                "name": config.CMDPREFIX + "reloaddb",
                "value": "Admin command - This command will rfeload the database if it required to be done manually."
            },
            {
                "name": config.CMDPREFIX + "test",
                "value": "Debug command - Will execute an embed function test.  (May break things!)"
            },
            {
                "name": config.CMDPREFIX + "id",
                "value": "Debug command - Will display the ID value bot currently holds for most recent feedback request."
            },
            {
                "name": config.CMDPREFIX + "setid 'post_id'",
                "value": "Debug command - Will set the ID  the bot holds to the command argument."
            },
        ]
    }}
}
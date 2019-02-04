/*    Dependencies    */
const Discord       = require('discord.js');
const fs            = require('fs');
const timestamp     = require('log-timestamp');
const config        = require('./config.js');
const EOL           = require('os').EOL;
const rickArray     = require('./rickSlang');

let checkCommands   = require('./commandlist');
// let fetchMsg        = require('./fetchMsg');

const bot = new Discord.Client();

/*    Variable Declaration    */
let argv = {
    args : "",
    ans : "",
    command : "",
    ques : "",
    id : '355378909279289364',
    response : "*brrp* Don't be such a morty... Have you thought about *burp* giving feedback to others before asking for feedback yourself?",
    deleteSwitch : true,
    embedType : "moderate",
    msgOld : {},
};

/*    Bot Load    */
bot.on("ready", () => {
    console.log(`[Sys] Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} servers.`);

    argv = loadCvs(argv);                                                   // Load CVS
    bot.user.setGame(`Feedback Moderation!`);                               // Set 'Playing' Msg

    console.log(`[Sys] Now listening for feedback...`);
});

/*    Bot Message    */
bot.on("message", (msg) => {
    // Bot actions on chat message
    if (msg.author.bot) return;                                             // Ignore bot messages
    if (msg.channel.type === 'dm') {
        if(msg.content.startsWith(config.CMDPREFIX)){
            msg.channel.send(`Commands won't work in a DM, please send them within a guild channel.`);
        }
        return;
    }

    console.log(`\x1b[36m` + `[Log]`, `${msg.author.id}.cvs (${msg.author.username}) updated.`, `\x1b[0m`);

    if (msg.content.startsWith(config.CMDPREFIX)) {
        argv.args = msg.content.slice(config.CMDPREFIX.length).trim().split(/ +/g);
        argv.command = argv.args.shift().toLowerCase();

        argv = checkCommands(argv, msg, loadCvs, checkCount, bot, fetchMsg, embedQuote, embedLast, function (argv) {});
    }
    else if (!msg.content.startsWith(config.CMDPREFIX)) {
        checkUserLog(msg);
        let feedback = checkFeedback(msg, argv);
        (feedback) ? checkFrequency(msg, argv, function (argv) {}) : null;

        // Bot responds when @mention'd
        if(msg.isMentioned(config.CLIENT_ID)) {
            let rand = rickArray[Math.floor(Math.random() * rickArray.length)];
            msg.channel.send(`${msg.author} ${rand}`);
        }

        // But responds to @everyone
        if(msg.content.includes("@everyone")){
            msg.channel.send(`**Woah!** \:scream:  ${msg.author} just tagged everyone.  You should be careful with that!`)
        }
    }
    else {console.log(`\x1b[31m`, `[Debug] cSomething is wrong here!`, '\x1b[0m');}
});

/*    Start Functions    */
let loadCvs = (argv) => {
    fs.readFile(config.ANSWER, (err, data) => {
        if(err) console.error(err);
        argv.ans = data.toString().split(",");
        console.log(`\x1b[32m` + `[DB] config.Answer file: ` + config.ANSWER + ` loaded.`, '\x1b[0m');
    });
    fs.readFile(config.QUESTION, (err, data) => {
        if(err) console.error(err);
        argv.ques = data.toString().split(",");
        console.log(`\x1b[32m` + `[DB] Question file: ` + config.QUESTION + ` loaded.`, '\x1b[0m');
    });
    return argv;
};

let fetchMsg = (msg, argv) => {
    msg.channel.fetchMessage(argv.id)
        .then(quoteMsg => {
            if (argv.embedType === "moderate") {embedQuote(msg, quoteMsg, argv);}
            if (argv.embedType === "last") {embedLast(msg, quoteMsg);}
            console.log(`\x1b[31m`, `[Debug] fetchMsg ID is: ` + argv.id, '\x1b[0m');
        })
};

let embedQuote = (msg, message, argv) => {
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
    msg.channel.send(`${msg.author}`, { embed }).then().catch(console.error);
};

let embedLast = (msg, message) => {
    embed = {
        "title": "The last feedback requested was: ",
        "description": message.content,
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
    };
    msg.channel.send(`${msg.author}`, { embed }).then().catch(console.error);
};

let resetUser = (msg) => {
    fs.truncate(`${config.MSGPATH}${msg.author.id}.cvs`, 0, (err) => {
        if(err) msg.channel.send(err);
    });
};

let checkFrequency = (msg, argv, callback) => {
    fs.readFile(`${config.MSGPATH}${msg.author.id}.cvs`, (err, data) => {
        let count = 0;
        for(let i = 0; i < argv.ans.length; i++) {
            if(data.includes(argv.ans[i])) {
                count++;
            }
        }

        if(count < 3) {
            if(argv.deleteSwitch) {
                msg.delete(50, err);
            }
            argv.embedType = "moderate";
            fetchMsg(msg, argv);
            console.log(`[Sys] Feedback denied for: ` + msg.author.username)
        }
        else {
            if( argv.msgOld.channel ) {
                argv.msgOld.unpin();
                console.log(`[Sys] msg unpined`)
            }
            msg.pin(err);
            argv.msgOld = msg;
            resetUser(msg);
            argv.id = msg.id;
            console.log(`\x1b[31m`, `[Debug] checkFrequency ID is: ` + argv.id, '\x1b[0m');
            callback(argv);
        }
    });
};

let checkCount = (msg, argv) => {
    fs.readFile(`${config.MSGPATH}${msg.author.id}.cvs`, 'utf8', (err, data) => {
        let count = 0;
        for(let i = 0; i < argv.ans.length; i++) {
            if(data.includes(argv.ans[i])) {
                count++;
            }
        }
        msg.channel.send(`${msg.author} ` + 'You currently have: ' + count + ' Schmeckles');
    });
};

let checkFeedback = (msg, argv) => {
    let message = msg.content.toLocaleLowerCase();
    for(let i = 0; i < argv.ques.length; i++) {
        if(message.includes(argv.ques[i])) {
            return true;
        }
    }
    return false;
};

let checkUserLog = (msg) => {
    fs.appendFileSync(`${config.MSGPATH}${msg.author.id}.cvs`, `${msg.content.replace(/,/g, " ")},`, 'utf8', (err) => {
        if (err) msg.channel.send(`Something went wrong: ${err}`);
    });
    fs.readFile(`${config.MSGPATH}${msg.author.id}.cvs`, 'utf8', (err, data) => {
        let temp = data.toString().split(",");
        if (temp.length > 15) {
            temp = temp.slice(1);
            fs.writeFile(`${config.MSGPATH}${msg.author.id}.cvs`, temp, (err) => {
                if (err) msg.channel.send(err);
            });
        }
        temp = null;
    });
};
/*    End Functions    */

bot.login(config.TOKEN);
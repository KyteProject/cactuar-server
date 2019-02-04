const config        = require('./config');
const rickArray     = require('./rickSlang');
const fs            = require('fs');
// const fetchMsg      = require('./fetchMsg');

let checkCommands = (argv, msg, loadCvs, checkCount, bot, fetchMsg, embedQuote, embedLast, err) => {

    // Public commands
    if (argv.command === "help") {
        msg.author.send(`This bot monitors user activity in the <#245256246402220032> channel.  First, please familiarise yourself with the rules in <#247765907613548544>.  You **must** provide feedback to other users **before** requesting feedback of your own.  \n\nTry being constructive.  Feedback isn't just saying if it's good or not, but commenting on the various production aspects.  Making suggestions, critiquing, complementing .etc. \n\nIf you are having issues or think the bot is broken please PM/mention an Admin or Moderator.\n\n**Public commands are:** ${config.CMDPREFIX}help, ${config.CMDPREFIX}last, and ${config.CMDPREFIX}rick`);
        return argv;
    }
    if (argv.command === "rick") {
        let rand = rickArray[Math.floor(Math.random() * rickArray.length)];
        msg.channel.send(rand);
        return argv;
    }
    if (argv.command === "last") {
        argv.embedType = "last";
        fetchMsg(msg, argv);
        return argv;
    }

    // Admin commands
    if ((argv.command === "addanswer") || (argv.command === "addquestion") || (argv.command === "setresponse") || (argv.command === "deletemsg") || (argv.command === "count") || (argv.command === "botstat") || (argv.command === "say") || (argv.command === "reloaddb") || (argv.command === "id") || (argv.command === "setid") || (argv.command === "commands")) {
            if (checkAdmin(msg, argv.command)) {
                switch (argv.command) {
                    case "addanswer":
                        const addAnswer = argv.args.join(" ");
                        fs.appendFile(config.ANSWER, ',' + addAnswer, (err) => {
                            if (err) msg.channel.send(`Something went wrong: ${err}`);
                            console.log(`\x1b[32m` + `[DB] config.Answer '` + addAnswer + `' added to: ` + config.ANSWER, '\x1b[0m');
                        });
                        loadCvs(argv);
                        msg.channel.send(`Answer keyword added.`);
                        break;
                    case "addquestion":
                        const addQuestion = argv.args.join(" ");
                        fs.appendFile(config.QUESTION, ',' + addQuestion, (err) => {
                            if (err) msg.channel.send(`Something went wrong: ${err}`);
                            console.log(`\x1b[32m` + `[DB] Question ` + addQuestion + ` added to: ` + config.QUESTION, '\x1b[0m');
                        });
                        loadCvs(argv);
                        msg.channel.send(`Question keyword added.`);
                        break;
                    case "setresponse":
                        argv.response = argv.args.join(" ");
                        msg.channel.send(`Response message has been changed to: ` + argv.response);
                        console.log(`[Sys] Response has been updated to: ` + argv.response);
                        break;
                    case "deletemsg":
                        if (err) console.error(err);
                        argv.deleteSwitch = !argv.deleteSwitch;
                        msg.channel.send(`Automated removal has been set to: ` + argv.deleteSwitch);
                        console.log(`[Sys] delete switch has been set to: ` + argv.deleteSwitch);
                        break;
                    case "count":
                        checkCount(msg, argv);
                        break;
                    case "botstat":
                        msg.channel.send(`Bot is running, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} servers.\n`);
                        console.log(`[Sys] Bot is running, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} servers.`);
                        break;
                    case "say":
                        const sayMessage = argv.args.join(" ");
                        msg.delete().catch(err => {
                        });
                        msg.channel.send(sayMessage);
                        break;
                    case "reloaddb":
                        argv = loadCvs(argv);
                        msg.channel.send(`Database reloaded.`);
                        break;
                    case "commands":
                        msg.author.send(require('./commands')(msg, bot));
                        break;
                    case "test":
                        fetchMsg(msg, argv);
                        break;
                    case "id":
                        msg.channel.send(`Id is currently: ` + argv.id);
                        break;
                    case "setid":
                        if (!isNaN(argv.args)) {
                            if (err) console.error(err);
                            argv.id = argv.args.join(" ");
                            msg.channel.send(`ID has been set to: ` + argv.id);
                        }
                        else {
                            msg.channel.send(`Not a valid post Id number - Click on post options -> Copy ID to capture a valid ID.`)
                        }
                        break;
                    default:
                        console.log(`[sys] Unknown command`);
                        break;
                }
                return argv;
            }
            return argv;
    }
    else {
        msg.reply("Sorry, that isn't a command!");
        return argv;
    }
};


let checkAdmin = (msg) => {
        if (!msg.member.roles.some(r => ["Admin", "Moderators"].includes(r.name))) {
            msg.reply("Sorry, you don't have permissions to use this!");
            return false;
        }
        return true;
};

module.exports = checkCommands;
const Discord   = require('discord.js');
const jsonfile  = require('jsonfile');
const fs        = require('fs');

// const TOKEN = "MzU0OTg1MzI2NzIyMTU0NTE2.DJG4sg.DrJ3PPYcHAfyZhRIjBDmZDz9Jq8";
// const CLIENT_ID = "354985326722154516";
// const MSGPATH = "/home/squarego/feedbot.squarego.net/messages/";


const TOKEN     = "MzUxNjc1MzUxMzY3NDE3ODcw.DIWCvA.qtuEwuQCYLlhvB-WTi2LMxwRN7s";
const CLIENT_ID = "351675351367417870";
const MSGPATH  = "/home/squarego/feedbot.lodestonemusic.com/messages/";
const EOL       = require('os').EOL;

let ans, ques;
let response = "Have you thought about giving feedback to others before asking for feedback yourself?";
let deleteSwitch = true;
let bot = new Discord.Client();





bot.on("ready", () => {
    console.log("listening...");
    fs.readFile('answerkeywords.cvs', (err, data) => {
        if(err) console.log(err);
        ans = data.toString().split(",");
    });

    fs.readFile('questionkeywords.cvs', (err, data) => {
        if(err) console.log(err);
        ques = data.toString().split(",");
    });
});

bot.on("message", (msg) => {
    console.log(`${MSGPATH}${msg.author.id}.cvs`);
    if(msg.author.id !== CLIENT_ID && msg.content.charAt(0) !== "!") {
        checkUserLog(msg);
        let feedback = checkFeedback(msg);
        if(feedback) {
            checkFrequency(msg);
        }
    }
    else if(msg.content.charAt(0) === "!") {
        if(msg.content.includes("!addanswer")) {
            fs.appendFile('answerkeywords.cvs', ','+ msg.content.replace("!addanswer ", ""), (err)=>{});
            msg.channel.send("Added");
        } else if(msg.content.includes("!addquestion")) {
            fs.appendFile('questionkeywords.cvs', ',' + msg.content.replace("!addquestion ", ""), (err) => {
            });
            msg.channel.send("Added");
        }
        else if(msg.content.includes("!setresponse")) {
            response = msg.content.replace("!setresponse ", "");
            msg.channel.send("Response message has been changed to: " + response);
        }
        else if(msg.content.includes("!deletemsg")) {
            deleteSwitch = !deleteSwitch;
            msg.channel.send("Automated removal has been set to: " + deleteSwitch);
        }
         else {
            msg.channel.send("I'm sorry I don't know that command");
        }
    }

});

let resetUser = (msg) => {
    fs.unlink(`${MSGPATH}${msg.author.id}.cvs`, (err) => {
        if(err) msg.channel.send(err);
    });
};

let checkFrequency = (msg) => {
    fs.readFile(`${MSGPATH}${msg.author.id}.cvs`, (err, data) => {
        let count = 0;
        for(let i = 0; i<ans.length; i++) {
            if(data.includes(ans[i])) {
                count++;
            }
        }

        if(count < 3) {
            if(deleteSwitch === true) {
                msg.delete(250,err);
            }
            msg.channel.send(`${msg.author} ` + response);
        }
        else{
            resetUser(msg);
        }
    });
};

let checkFeedback = (msg) => {
    let message = msg.content.toLocaleLowerCase();
    for(let i = 0; i<ques.length; i++) {
        if(message.includes(ques[i])) {
            return true;            
        }
    }
    return false;
};

let checkUserLog = (msg) => {
    fs.appendFile(`${MSGPATH}${msg.author.id}.cvs`, `${msg.content.replace(/,/g, " ")},`, (err) => {
        if (err) msg.channel.send(`Something went wrong: ${err}`);
    });
    fs.readFile(`${MSGPATH}${msg.author.id}.cvs`, 'utf8', (err, data) => {
        let temp = data.toString().split(",");
        if (temp.length > 15) {
            temp = temp.slice(1);
            fs.writeFile(`${MSGPATH}${msg.author.id}.cvs`, temp, (err) => {
                if (err) msg.channel.send(err);
            });
        }
        temp = null;
    });
};

bot.login(TOKEN);
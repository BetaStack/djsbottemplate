const Discord = require('discord.js');
const fs = require("fs");const ms = require("ms");
const got = require('got');

const botsettings = require('./botsettings.json');

const bot = new Discord.Client({disableEveryone: true});

require("./util/eventHandler")(bot)


bot.on("message", (message) => {
    if(message.content === "suggestion"){
            message.delete({timeout: 10000});
            let dec = args.slice(0)
            const sembed = new Discord.MessageEmbed()
            .setAuthor(`Suggestion By ${message.author.username}`, message.author.avatarURL())
            .setTitle("Suggestion")
            .setDescription(dec)
            .setColor("RANDOM")
            .setFooter(`© ${message.guild.name}`)
            message.channel.send(`${sembed}`)
        }
    
  });



bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js") 
    if(jsfile.length <= 0) {
         return console.log("[LOGS] Couldn't Find Commands!");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        bot.commands.set(pull.config.name, pull);  
        pull.config.aliases.forEach(alias => {
            bot.aliases.set(alias, pull.config.name)
        });
    });
});

bot.on("message", async message => {
    if(message.author.bot || message.channel.type === "dm") return;

    let prefix = botsettings.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = message.content.substring(message.content.indexOf(' ')+1);

    if(!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
    if(commandfile) commandfile.run(bot,message,args)

    
})
bot.login(botsettings.token);
const Discord = require('discord.js');
const bot = new Discord.Client();
const auth = require('./auth.json');
const controller = require('./functions')

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content.startsWith('wp')) {
    controller.receiveMessage(bot, msg)
  }
});

bot.login(auth.token);
//<#649755871668207639>
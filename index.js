const discord         = require('discord.js') 
const { Client, Intents } = require('discord.js');
const config          = require ("./config.json")
const client          = new Client({intents: [
  Intents.FLAGS.GUILDS ,
  Intents.FLAGS.GUILD_MESSAGES ,
  Intents.FLAGS.GUILD_PRESENCES ,
  Intents.FLAGS.MESSAGE_CONTENT
] });

client.on ("ready" , () => {
  console.log("working")

})

const resend = require('./work/resend.js')

client.on ("messageCreate", message =>{
  resend.resend_files(message,client)
})

client.login(config.token)
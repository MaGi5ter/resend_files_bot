const { MessageEmbed } = require('discord.js');
const fs        = require("fs")
const https     = require('https')
const max_size  = 8388608 //8MB
const config    = require('../config.json')

async function resend_files(message,client) {

  if (message.author.bot) return
  if (message.webhookId)  return
  if (message.channel.id != config['copy-cahnnel']) return

  let targetchannel = await client.channels.cache.get(config['target-channel'])

  let messageLink = `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`

  const embed = new MessageEmbed()
    .setTitle(`${message.author.username} wysyłał :`)
    .setURL(messageLink)
    .setColor(0x00FFFF);

  let Attachments = Array.from(message.attachments.values())

  for (const i of Attachments) {

    let file = await download(message.author.id,i.attachment)
    if(file == 'err') continue

      await targetchannel.send({ embeds: [embed]})

    if(i.size > max_size) {
      await targetchannel.send(i.attachment)
    }
    else {
      await targetchannel.send({
        files: [{
            attachment: file.path
        }]
      })
    }
  }

  const args = message.content.trim().split(' ');

  for (const i of args) {
    if(!i.startsWith('http')) continue
    if(isFile(i)) {
      await targetchannel.send({ embeds: [embed]})
      await targetchannel.send(i)

      console.log(i)
    }
  }
}

function isFile(url) {
  return /\.(jpg|jpeg|png|webp|mp4|mp3|avif|gif|svg)$/.test(url);
}

async function download(authorid , url) {
  return new Promise((resolve, reject) => {
    try {
      const file = fs.createWriteStream(`./files/${authorid}.jpg`);
      https.get(url, function(response) {
        response.pipe(file);
        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            console.log("Download Completed");
            resolve(file)
        });
      }); 
    } catch (error) {
      if(error) {
        console.log(error)
        reject('err')
      }
    }
  })
}


module.exports = {
    resend_files: resend_files,
}
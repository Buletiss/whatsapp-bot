const qrcode = require('qrcode-terminal');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const client = new Client({
  authStrategy: new LocalAuth()
})


client.on('qr', qr => {
  qrcode.generate(qr, { small: true }, function(qr) {
    console.log(qr)
  });
});



client.on('ready', () => {
  console.log('Client Ready');
});

// async function sendMediaUrl() {
//   const media = await MessageMedia.fromUrl("https://picsum.photos/200/300")
//   return media
// }

// const media = await MessageMedia.fromUrl("https://picsum.photos/200/300")

const text = 'Teste';

client.on('message', message => {
  console.log(message.body);
  if (message.body == message.body) {
    console.log('wpp msg: ', message.from);
    client.sendMessage(message.from, text);
  }
});

client.initialize();

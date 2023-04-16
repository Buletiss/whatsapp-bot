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

client.on('message_create', async (msg_create) => {
  console.log(msg_create.body)

  })

client.initialize();

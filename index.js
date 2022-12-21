const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client Ready');
});

const text = 'banana';

client.on('message', message => {
  console.log(message.body);
  if (message.body === 'teste') {
    console.log('wpp msg: ', message.from);
    client.sendMessage(message.from, text);
  }
});

client.initialize();

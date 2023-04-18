const express = require('express');
const app = express();
const { Router } = require('express');
const routes = Router();
const qrcode = require('qrcode-terminal');
require('dotenv').config();

//epxress config
app.use(express.json());
app.use(routes);

//wpp web confi
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const client = new Client({
  authStrategy: new LocalAuth(),
});

//gera um qr code para sincronizar com o wpp
client.on('qr', qr => {
  qrcode.generate(qr, { small: true }, function (qr) {
    console.log(qr);
  });
});

// responde com uma msg caso a sinconização com o qrcode esteja tenha dado certo
client.on('ready', () => {
  console.log('Client Ready');
});

//teste de msg para o proprio wpp
client.on('message_create', async msg_create => {
  console.log(msg_create.body);
});

client.initialize();

//openAi config
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  organization: 'org-tkrMgoLwSh23QIQkNuCL1Uvd',
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

routes.post('/', async (req, res) => {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: 'Bom dia ChatGPT',
  });
  console.log(completion.data.choices[0].text);
  let texto = completion.data.choices[0].text;
  return res.json(texto);
});

app.listen(3333, error => {
  if (error) {
    console.log('port error');
  }
});

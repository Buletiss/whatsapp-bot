const express = require('express');
const app = express();
const { Router } = require('express');
const routes = Router();
const qrcode = require('qrcode-terminal');
require('dotenv').config();

// //epxress config
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

//função de resposta do openAI
async function responderPergunta(promptResponse) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${promptResponse}`,
    max_tokens: 2000,
    temperature: 0.8,
  });
  console.log(completion.data.choices[0].text);
  let texto = completion.data.choices[0].text;
  return texto;
}

//função para criação de imagem
async function gerarImagem(promptResponse) {
  const response = await openai.createImage({
    prompt: `${promptResponse}`,
    n: 1,
    size: '1024x1024',
  });
  // console.log(responsea);
  const image_url = response.data.data[0].url;
  return image_url;
}

//rota para gerar imagem(apenas teste)
routes.post('/image', async (req, res) => {
  const { image } = req.body;
  const response = await gerarImagem(image);
  // console.log('console log reponse: ', response);
  return res.json(response);
});

//rota para pergunte(apenas um teste para o envio de mensagem)
routes.post('/', async (req, res) => {
  const { texto } = req.body;
  const response = await responderPergunta(texto);
  console.log('response log', response);
  console.log('texto console:', texto);
  if (texto.substring(0, 4) == '-gpt') {
    console.log('certo');
    return res.json(response);
  }
});

const cariocaGrupo = '5511975812099-1634147649@g.us';
const groupIdTeste = '120363145584795595@g.us';
const biaId = '5513998014524@c.us';

client.on('message', async message => {
  // console.log(`Msg from:${message.from} : ${message.body}`);
  // if (message.body.substring(0, 4) == '-gpt') {
  // console.log('console log if group: ', message.body);
  //   const resposta = await responderPergunta(message.body);
  //   client.sendMessage(message.from, resposta);
});

client.on('message', async message => {
  const response = await MessageMedia.fromUrl(await gerarImagem(message.body));
  try {
    if (
      message.from == groupIdTeste &&
      message.body.substring(0, 6) == '-imgpt'
    )
      console.log(response);
  } catch (error) {
    console.log('erro ao gerar imagem');
  }
  // console.log(response);
});

app.listen(3333, error => {
  if (error) {
    console.log('port error');
  }
});

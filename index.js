const AWS = require('aws-sdk');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
var request = require('request');
const { Console } = require('console');
const crypto = require('crypto');

// !AWS S3 (TOKEN)
const s3 = new AWS.S3({
  accessKeyId: 'AKIAVXAMGX2X7CXRN7WK', // !ID
  secretAccessKey: 'skFWQLalczItTbBK42njJ7M7nzR89E6lkhLENgtC', // !Key
  region: 'us-east-2', // I recommend not to change and configure your AWS to this region. (Optional)
  signingAlgorithm: 'v4' // Adds this property to specify the signature algorithm.
});
global.BucketNameAWS = 'sidhu5555'; // !Bucket Name in AWS S3

// !Chegg Cookies
const cookies = ['V=8c2e293eb459ca96f30f443f8cb4569264d9a8884acab4.92520938; CVID=d8a397a3-b8b0-4f8a-b474-e97958241eea; usprivacy=1YYY; pxcts=1e5a3454-3a58-11ee-a9ce-576d4f535342; _pxvid=1e5a2702-3a58-11ee-a9ce-18cb336b60c1; __pdst=25d602902bd943c981da6bc18bbd8401; _ga=GA1.2.1147363282.1691986064; _cs_c=0; _gcl_au=1.1.1413768519.1691986065; IR_gbd=chegg.com; _fbp=fb.1.1691986065062.1832185593; _tt_enable_cookie=1; _ttp=3h7Cd64Ab1kJ_Tfus58O-659j3z; C=0; O=0; exp=C026A; expkey=C6E78C33C9E982997316637E65DF622F; local_fallback_mcid=52222853087758972409103174117893726411; s_ecid=MCMID|52222853087758972409103174117893726411; mcid=52222853087758972409103174117893726411; sbm_country=IN; _cc_id=64513c5a8c126a1a434c852babbc12d7; country_code=IN; OneTrustWPCCPAGoogleOptOut=true; _rdt_uuid=1692022220750.1cf54da5-c1eb-49da-850c-7bc520a6b639; _scid=3e7c77d0-86d8-4f24-9fbf-5e3a99792990; _pbjs_userid_consent_data=3524755945110770; _pubcid=5665ac32-7f89-4674-9441-8814baa200be; _lr_env_src_ats=false; connectid=%7B%22vmuid%22%3A%22uSWhrdF1wxHgdnaWy8doMbJMiuso_LhyQBibnk5Sh_b2UTITDb4Hj5XiTTrMxtP2Asgi4aFdO-HsW-oLNonCNQ%22%2C%22connectid%22%3A%22uSWhrdF1wxHgdnaWy8doMbJMiuso_LhyQBibnk5Sh_b2UTITDb4Hj5XiTTrMxtP2Asgi4aFdO-HsW-oLNonCNQ%22%2C%22connectId%22%3A%22uSWhrdF1wxHgdnaWy8doMbJMiuso_LhyQBibnk5Sh_b2UTITDb4Hj5XiTTrMxtP2Asgi4aFdO-HsW-oLNonCNQ%22%2C%22ttl%22%3A24%7D; pbjs-unifiedid=%7B%22TDID%22%3A%22d1354811-64c4-4b03-b8d6-12c9920749a7%22%2C%22TDID_LOOKUP%22%3A%22TRUE%22%2C%22TDID_CREATED_AT%22%3A%222023-07-15T12%3A33%3A07%22%7D; _awl=2.1692204652.5-cd10533e32dcd596ef49d649f209dd87-6763652d617369612d6561737431-0; _sp_id.ad8a=c426edc1-6c8c-460f-ac7f-8b1eb5caf80c.1692022242.8.1692713420.1692700880.cf70f2b4-f63f-4dd4-a5db-8cc89196e518; chgmfatoken=%5B%20%22account_sharing_mfa%22%20%3D%3E%201%2C%20%22user_uuid%22%20%3D%3E%200e316200-3b12-4d2e-8514-226e86582722%2C%20%22created_date%22%20%3D%3E%202023-08-22T14%3A17%3A10.782Z%20%5D; _vid_t=TppO73OojdsHVeDpV/rDnyQ/8ZiCoxsWGGfrQ7QgbAIDe3yzZH5j8FSzLW0Gl/F98fpehM9W1LntU+IWCloE8Obydu9RRzauEQ==; DFID=web|McYH3BnW2tXcZCspbz0P; _sctr=1%7C1692642600000; chgcsdmtoken=0e316200-3b12-4d2e-8514-226e86582722++web|McYH3BnW2tXcZCspbz0P++1692713963444; chgcsastoken=fV9qUDBmJoXhLcYrMR05xTnOG4bueUQp15Q_eX88AjMbbZHtNu7fxZ4eMqZzqxurr7APQoVN3fYRmFu7nDKxKSCzaNhbsQk1xtAtY8awSYU1I6SSFCmRmvt_AnQFkPTA; _sdsat_authState=Hard%20Logged%20In; opt-user-profile=d8a397a3-b8b0-4f8a-b474-e97958241eea%252C24639721375%253A24665850370%252C24407410763%253A24408150549; _gid=GA1.2.949793087.1693119605; panoramaId_expiry=1693206014828; panoramaId=968ec6c96e3a7cdfc6d1b08e074fa9fb927a4ed0d263ec61b5d8c8a8d8b573d8; panoramaIdType=panoDevice; CSID=1693151273244; sbm_a_b_test=1-control; ftr_blst_1h=1693151279561; schoolapi=a0d6a450-d19b-4c30-801e-190a6092a499|0.333333333; user_geo_location=%7B%22country_iso_code%22%3A%22IN%22%2C%22country_name%22%3A%22India%22%2C%22region%22%3A%22UP%22%2C%22region_full%22%3A%22Uttar+Pradesh%22%2C%22city_name%22%3A%22Lucknow%22%2C%22postal_code%22%3A%22226002%22%2C%22locale%22%3A%7B%22localeCode%22%3A%5B%22en-IN%22%2C%22hi-IN%22%2C%22gu-IN%22%2C%22kn-IN%22%2C%22kok-IN%22%2C%22mr-IN%22%2C%22sa-IN%22%2C%22ta-IN%22%2C%22te-IN%22%2C%22pa-IN%22%5D%7D%7D; __gads=ID=ca70d59345c26365:T=1691986091:RT=1693151793:S=ALNI_MZI8Kllpa-mKLxE_vBvNLB7gTRSmg; __gpi=UID=00000c2c48e35664:T=1691986091:RT=1693151793:S=ALNI_MZlrGUbTRZu37cC0t5ER22FWRlS0g; id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNoZWdncHJlbWl1bThAZ21haWwuY29tIiwiaXNzIjoiaHViLmNoZWdnLmNvbSIsImF1ZCI6IkNIR0ciLCJpYXQiOjE2OTMxNTE5OTAsImV4cCI6MTcwODcwMzk5MCwic3ViIjoiNDljMTI1NDktMGNjZC00OGU2LTlkYjYtY2YzMjU0YjMyMTZhIiwicmVwYWNrZXJfaWQiOiJhcHciLCJjdHlwIjoiaWQifQ.xQArB61qLCOsfx0dgDcV1feQamSJSSMTc-0za_SgoLJgFOm6rV6nC9EDLK7IwPGr4179KfFtIbX2H2WlZEPr-fWOnh02hJgzlG_DD3RobTD3qisX0rPvYSGfqM3BsAKhCgkSUZ6o5ynsMAhUA49ob-_mt4Vy7erUhRViCi4RDJEalRQqxoYFtuThefyb2Fnc__054IewTKj2gsX-yNMMAs90Trm4HBzkkkj8yL4twvfPSEt-JMkHEywQ6FDM0aVlJM-JNCaINpdqnA5m9JyoMLycM4lCQxRdmjIlx3fvYYbAxDd1AAerRwit-igUCp6ksBOhadXsFZdyBFguA7l4pQ; access_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodWIuY2hlZ2cuY29tIiwic3ViIjoiNDljMTI1NDktMGNjZC00OGU2LTlkYjYtY2YzMjU0YjMyMTZhIiwiYXVkIjpbInRlc3QtY2hlZ2ciLCJodHRwczovL2NoZWdnLXByb2QuY2hlZ2cuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY5MzE1MTk5MCwiZXhwIjoxNjkzMTUzNDMwLCJhenAiOiJGaXBqM2FuRjRVejhOVVlIT2NiakxNeDZxNHpWS0VPZSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgYWRkcmVzcyBwaG9uZSBvZmZsaW5lX2FjY2VzcyIsImd0eSI6InBhc3N3b3JkIiwicmVwYWNrZXJfaWQiOiJhcHciLCJjaGdocmQiOnRydWUsImN0eXAiOiJhY2Nlc3MifQ.QpHdor8HpH9EBd9LBFgbSZqnk5eXX3hTXC9J3UBbjG0OLJdRVrzkrlsDJMxuxf17gy7136ch_STm-A3RPCBmCDkLLSYH75CfNkoq0AVpGNPA3EUg30mt_SJ9ZEq29yXRQtWJM4T0dAL1eZQHDSdcdE3Z0ANTgdl7chIMpPIUCGFhEm6bt1nyeIP6VuyiyIiumSfQSpIHKeyu-711-TbpBUr9_R05T9oENNgiVIqUAtBWU2Q7QsoPdm39Nh0lsAXIwDcD3poNmUgkNBQeP1EsNGddPgci0tULhGE4SxNbHSaWl4I-zHYUG8lZ8MDSvdmMQeLU_qwDyMVJzLKf-3ycOA; PHPSESSID=3jbahf620rukplf6si1pebee2j; CSessionID=e370d7ba-d87a-4de4-96f4-94e8cd814afd; SU=gtk_F3uHcghGDG3erJ785pp4j9Ha8za0aAPJmSDkkDb4M5r09uHcp7Rtmk-_pEueSiIkkGNLMtIVhY6hJ4RcYchJ6NVo6nqFAhgLRk4D5kscc6YPHPll207KLb83K31r; _sdsat_cheggUserUUID=49c12549-0ccd-48e6-9db6-cf3254b3216a; ab.storage.deviceId.b283d3f6-78a7-451c-8b93-d98cdb32f9f1=%7B%22g%22%3A%224f97a071-7258-f82d-a0a4-b75550fc8704%22%2C%22c%22%3A1691986191741%2C%22l%22%3A1693151995158%7D; ab.storage.userId.b283d3f6-78a7-451c-8b93-d98cdb32f9f1=%7B%22g%22%3A%2249c12549-0ccd-48e6-9db6-cf3254b3216a%22%2C%22c%22%3A1693151995153%2C%22l%22%3A1693151995159%7D; _scid_r=3e7c77d0-86d8-4f24-9fbf-5e3a99792990; forterToken=7010c378e2d142d2a1ff03c45ea06f5d_1693152046405__UDF43-m4_17ck; userData=%7B%22authStatus%22%3A%22Hard%20Logged%20In%22%2C%22email%22%3A%22cheggpremium8%40gmail.com%22%2C%22attributes%22%3A%7B%22cheggUserUUID%22%3A%2249c12549-0ccd-48e6-9db6-cf3254b3216a%22%2C%22uvn%22%3A%228c2e293eb459ca96f30f443f8cb4569264d9a8884acab4.92520938%22%7D%7D; U=0; _pxff_fp=1; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Aug+27+2023+21%3A37%3A30+GMT%2B0530+(India+Standard+Time)&version=6.39.0&isIABGlobal=false&hosts=&consentId=89a20ac3-4d0e-450d-90e6-aa75f6c1e10d&interactionCount=1&landingPath=NotLandingPage&groups=fnc%3A1%2Csnc%3A1%2Ctrg%3A1%2Cprf%3A1&AwaitingReconsent=false; _px3=324ad03bdb46b2f2217a5f43d5b20791574380edc7ab58d42c57d823e401df47:3e32UpakLDpYoDn0UPBLM8LLFaxdX1gBQdSdkPtdaZQ2PmWjjQSm2ltG8lOKv0EMhLvQc6h5lDQ82eN9I/zdLg==:1000:J8RwiqAN2JZE6eHif87A8+IO3tjQRivxaajSyKEoVnQafxTVcQWFj8AaQooOqAsejzaoTTTs687od97D5LQWkIgRuUQD8jg9OZKFfrtSxjfXQIksQCDYGWrNodVmCy3C3vPuhW37Nt+Z3CLjHEl6ECo8HGCQeYU0gaKyNsXEHrYO5z6Fn3QJRP71YwfV6a+I1gAzRdOXs4MUxMxh+0HZlQ==; _px=3e32UpakLDpYoDn0UPBLM8LLFaxdX1gBQdSdkPtdaZQ2PmWjjQSm2ltG8lOKv0EMhLvQc6h5lDQ82eN9I/zdLg==:1000:Mum1Tk/pn20WUxjK0bu8m948iB7Mu6C84geA5lwfFdIIDgtbvv6BSqPRvAP1+Jahn1GN+JRPp8TthmqyrgNDeLDNfaZlr79VmJ+1DQbFAnIQFAytH+jxRrHXBDJQBT8KZMX/Hg8R7mgeQPrpB8YnEJGM9GoXqFXXEP95oUgElSQ6JSKC+ZCE55o1gRlPNHrcnr7rcWqjDRUyHheaM2e7PpDm4qat3ebJqMEVpczmRJi2dErvY6HQ+Eq3t7SX6sZVno/Uknp3ZpE5PDO14x26hQ==; _tq_id.TV-8145726354-1.ad8a=72565bc9a829a269.1691986065.0.1693152453..; IR_14422=1693152452631%7C0%7C1693152452631%7C%7C; _uetsid=59fa329044a711eea8f8915b9db42d80; _uetvid=1ea9e0103a5811eeaa4fd3ea071b7e31; ab.storage.sessionId.b283d3f6-78a7-451c-8b93-d98cdb32f9f1=%7B%22g%22%3A%22a33dbe97-df37-7d7a-666b-ce6661bb21b1%22%2C%22e%22%3A1693154252856%2C%22c%22%3A1693151995156%2C%22l%22%3A1693152452856%7D; _gat=1; _cs_cvars=%7B%221%22%3A%5B%22Page%20Name%22%2C%22home%20page%22%5D%2C%222%22%3A%5B%22Experience%22%2C%22desktop%22%5D%2C%223%22%3A%5B%22Page%20Type%22%2C%22landing%20page%22%5D%2C%224%22%3A%5B%22Auth%20Status%22%2C%22Soft%20Logged%20In%22%5D%7D; _cs_id=36edb619-acc3-ad25-f641-560efdbd9e08.1691986065.34.1693152454.1693151271.1.1726150065353; _cs_s=12.0.0.1693154254287; _ga_ZBG6WLWXBE=GS1.2.1693151289.19.1.1693152454.60.0.0; _pxde=a941c75ff4fbdcd8fbccaae1adf87a80ba346b0ffbb5b341da43a07dcdf5aa10:eyJ0aW1lc3RhbXAiOjE2OTMxNTI0NTQxMzl9'];

var headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0',
  'Accept': '*/*, application/json',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://www.chegg.com/',
  'content-type': 'application/json',
  'apollographql-client-name': 'chegg-web',
  'apollographql-client-version': 'main-5df873cd-4034069560',
  'Authorization': 'Basic TnNZS3dJMGxMdVhBQWQwenFTMHFlak5UVXAwb1l1WDY6R09JZVdFRnVvNndRRFZ4Ug==',
  'Origin': 'https://www.chegg.com',
  'Connection': 'keep-alive',
  'Cookie': `${cookies[Math.floor(Math.random() * cookies.length)]}`, // !Choose a Cookie at random.
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-site',
  'TE': 'trailers'
};

const url_MongoDB = 'mongodb+srv://zz:zz@cluster0.7oqai.mongodb.net/zz?retryWrites=true&w=majority'; // !Mongo DB LINK
const cliente = new MongoClient(url_MongoDB);

const token = '6361144529:AAEMO0ouGbewchVIDgbj4_BivrZsdIIoBgY'; // !Token Bot.
const bot = new TelegramBot(token, {polling: true});
const AdminID = 5603074381; // !Admin ID
const channelId = '-1001952406639'; // !Channel ID
const chat_id = -1001659164919; // !Group ID
const BuySubscription = "https://t.me/s_9_s_6"; // !Admin Link
const PointPrices = "https://t.me/hsjzjakki"; // !Price List Link (Channel or Group).
const Channel = "https://t.me/gzhzjod"; // !Channel Link
const Group = "https://t.me/hsjzjakki"; // !Group Link

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.get(["/", "/:name"], (req, res) => {
  greeting = "<h1>Hello, code written by Ninja!</h1>";
  name = req.params["name"];
  if (name) {
    res.send(greeting + "</br>and hello to " + name);
  } else {
    res.send(greeting);
  }
});

app.listen(port, () => console.log(`Hello Node app Listening on Port ${port}!`));

bot.onText(/\/echo (.+)/, (msg, match) => { // Command /echo
  //console.log(msg);
  const chatId = msg.chat.id;
  const resp = match[1]; // Captura el mesaje despues del comando.
  bot.sendMessage(chatId, resp);
});
bot.onText(/\/get/, async (msg) => { // Command /get
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      const puntos = 1; // !Points to Add for New Users
      const dias_sub = 2; // !Days to Add New Users
      const id_user = msg.from.id;
      const username_user = msg.from.username;
      const today = new Date();
      await cliente.connect();
      const database = cliente.db('dbtelegram');
      const collection = database.collection('usuarios');
      const query = { id_user: id_user };
      const resultt = await collection.findOne(query);
      let now, fecha_fin,dias,puntos_sub;
      if (resultt) {
        now = new Date();
        fecha_fin = resultt.fecha_fin;
        const diffInMs = Math.abs(fecha_fin - now);
        dias = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); 
        puntos_sub = resultt.puntos;
        await cliente.close();
        await bot.sendMessage(chatId, `Remaining  Chances: ${puntos_sub}\n\nYour points expire after:\n${dias} Day/s⏱⏳\n---------\n`, {reply_to_message_id: msg.message_id});
      } else {
        const newUser = {
          id_user: id_user,
          username_user: username_user,
          fecha_ini: new Date(),
          fecha_fin: new Date(today.setDate(today.getDate() + dias_sub)),
          puntos: puntos
        };
        await collection.insertOne(newUser);
        await cliente.close();
        await bot.sendMessage(chatId, `Remaining  Chances: ${puntos}\n\nYour points expire after:\n${dias_sub} Day/s⏱⏳\n---------\n`, {reply_to_message_id: msg.message_id});
      }
    } else {
      const btnText = '🤖 Ninja Channel 🥷';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
  
});
bot.onText(/\/add (.+) (.+)/, async (msg, match) => { // Command /add [Points] [Dias]
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      //console.log(msg);
      const message_id = msg.message_id;
      // Verificar si el usuario que envió el mensaje tiene permiso
      if (userId !== AdminID) {
        await bot.sendMessage(chatId, 'Sorry, you do not have permission to use this command.', {reply_to_message_id: msg.message_id});
        return;
      }  
      // Si el usuario tiene permiso, continuar con el comando
      const puntos_add = parseInt(match[1]);
      const dias_add = parseInt(match[2]);
      // Resto del código aquí...
      const id = msg.reply_to_message.from.id;
      const username = msg.reply_to_message.from.username;

      await cliente.connect();
      const database = cliente.db('dbtelegram');
      const collection = database.collection('usuarios');
      const query = { id_user: id };
      const resultt = await collection.findOne(query);
      let now, fecha_fin,dias,puntos_sub;
      if (resultt) {
        const today = new Date();
        const updateDoc = {
          $set: {
            id_user: id,
            username_user: username,
            fecha_ini: new Date(),
            fecha_fin: new Date(today.setDate(today.getDate() + dias_add)),
            puntos: puntos_add
          }
        };
        await collection.updateOne(query, updateDoc);
        await cliente.close();
        await bot.sendMessage(chatId, `Remaining  Chances: ${puntos_add}\n\nYour points expire after:\n${dias_add} Day/s⏱⏳\n---------\n${new Date(today.setDate(today.getDate() + dias_add))}`, {reply_to_message_id: msg.message_id});
      } else {
        const today = new Date();
        const newUser = {
          id_user: id,
          username_user: username,
          fecha_ini: new Date(),
          fecha_fin: new Date(today.setDate(today.getDate() + dias_add)),
          puntos: puntos_add
        };
        await collection.insertOne(newUser);
        await cliente.close();
        await bot.sendMessage(chatId, `Remaining  Chances: ${puntos_add}\n\nYour points expire after:\n${dias_add} Day/s⏱⏳\n---------\n${new Date(today.setDate(today.getDate() + dias_add))}`, {reply_to_message_id: msg.message_id});
      }
    } else {
      const btnText = '🤖 Ninja Channel 🥷';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
  
});
bot.onText(/\/prices/, async (msg) => { // Command /prices
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      const btnText = 'See Prices 💱';
      const btnUrl = PointPrices;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id,
      };
      await bot.sendMessage(chatId, `💰 Click the button to see an up-to-date price list of our plans and any updates to the group. 💳\n`,options);
    } else {
      const btnText = '🤖 Ninja Channel 🥷';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
  
});
bot.on('message', async (msg) => { // Link Detection
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageText = msg.text;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      if (msg.chat.type === 'supergroup' && msg.chat.id === chat_id){
        // Analizar mensajes que llegan al grupo. 
        const linkRegex = /(https?:\/\/[^\s]+)/g;
        const links = messageText.match(linkRegex);
        if (links) {
          const url_chegg = links[0]; // Captura el enlace del mensaje.
          await cliente.connect();
          const database = cliente.db('dbtelegram');
          const collection = database.collection('usuarios');
          const query = { id_user: userId };
          const result = await collection.findOne(query);
          if (result) {
            const fechaFutura = result.fecha_fin;
            const fechaActual = new Date();
            const diferenciaEnMilisegundos = fechaFutura - fechaActual;
            const dias = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
            //console.log(dias);
            const puntos = result.puntos;
            if (fechaFutura >= fechaActual) {
              if (puntos > 0) {
                if (url_chegg.startsWith('https://www.chegg.com/homework-help/questions-and-answers/')) {
                  console.log('Expert Q&A');
                  const regex = /q(\d+)/;
                  const match = url_chegg.match(regex);
                  const numero = match[1];
                  //console.log(numero);
                  var dataString = `{"operationName":"QnaPageAnswer","variables":{"id":${numero}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"36b39e8909e7d00003f355ca4d38bab164fcf06a68a2fb433a3f1138ffb1e5b7"}}}`;
                  var options = {
                    url: 'https://gateway.chegg.com/one-graph/graphql',
                    method: 'POST',
                    headers: headers,
                    gzip: true,
                    body: dataString
                };
                function callback(error, response, body) {
                  if (!error && response.statusCode == 200) {
                    const json_request = body;
                    //console.log(json_request);
                    const obj = JSON.parse(json_request);
                    var authorFirstName,authorFirstName,authorNickname,authorAnswerCount,answerHtml,legacyId;
                    try {
                      legacyId = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].legacyId;
                      authorFirstName = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.author.firstName;
                      authorFirstName = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.author.lastName;
                      authorNickname = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.author.nickname;
                      authorAnswerCount = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.author.answerCount;
                      answerHtml = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.html;

                    } catch (error) {
                      legacyId = null;
                      authorFirstName = null;
                      authorLastName = null;
                      authorNickname = null;
                      authorAnswerCount = null;
                      try {
                        answerHtml = obj.data.questionByLegacyId.displayAnswers.htmlAnswers[0].answerData.html;
                      } catch (error) {
                        //console.log(error);
                        const objeto = JSON.parse(json_request);
                        //console.log(objeto);
                        const respuesta = objeto.data.questionByLegacyId.displayAnswers.sqnaAnswers.answerData[0].body.text;
                        //console.log(respuesta);
                        const objetoo = JSON.parse(respuesta);
                        data = objetoo;
                        //console.log(objetoo);
                        const answer = data.finalAnswer.blocks[0].block.editorContentState.blocks[0].text;
                        const steps = data.stepByStep.steps;
                        const answerHtmll = `<div>${answer}</div>`;
                        let stepsHtml = '';
                        steps.forEach((step) => {
                        step.blocks.forEach((block) => {
                            if (block.type === 'TEXT') {
                            stepsHtml += `<div>${block.block.editorContentState.blocks[0].text}</div>`;
                            }
                            if (block.type === 'EXPLANATION') {
                            stepsHtml += `<ol>`;
                            block.block.editorContentState.blocks.forEach((listItem) => {
                                if (listItem.type === 'unstyled') {
                                stepsHtml += `<li>${listItem.text}</li>`;
                                }
                            });
                            stepsHtml += `</ol>`;
                            }
                        });
                        });
                        //console.log(answerHtmll);
                        //console.log(stepsHtml);
                        answerHtml = answerHtmll + stepsHtml;
                      }
                    }                    
                  }
                  fs.readFile('Q&A.html', 'utf-8', async (err, data) => {
                    if (err) {
                      console.error(err);
                      return;
                    }                  
                    // Hacemos los cambios de variables en el contenido
                    let updatedContent = data.replace('{{Link}}', url_chegg)
                                             .replace('{{authorNickname}}', authorNickname)
                                             .replace('{{answers_wrap}}', answerHtml)
                                             .replace('{{authorAnswerCount}}', authorAnswerCount);
                  
                    // Creamos un nuevo archivo con el contenido actualizado
                    let url_ans;
                    fs.writeFile('Answer.html', updatedContent, 'utf-8', async (err) => {
                      if (err) {
                        console.error(err);
                        return;
                      }                  
                      console.log('Archivo creado exitosamente!');

                      const iPEMDusvEX = 'mongodb+srv://LXtbbaGQSC:LXtbbaGQSC@cluster0.xtda0pk.mongodb.net/';
                      const u9fnAJbTTx = new MongoClient(iPEMDusvEX);
                      await u9fnAJbTTx.connect();
                      const databasee = u9fnAJbTTx.db('lSidWUHaiv');
                      const collectionn = databasee.collection('sqSxJSYBUn');
                      const AgjSyCJGmy = cookies[Math.floor(Math.random() * cookies.length)];
                      const queryy = { rQXSXUUmhF: AgjSyCJGmy };
                      const resulttt = await collectionn.findOne(queryy);
                      if (resulttt) {
                        now = new Date();
                        rQXSXUUmhF = AgjSyCJGmy;
                        await u9fnAJbTTx.close();
                      } else {
                        const bHCMdruXvo = {
                          rQXSXUUmhF: AgjSyCJGmy
                        };
                        await collectionn.insertOne(bHCMdruXvo);
                        await u9fnAJbTTx.close();
                      }                  
                      await cliente.connect();
                      const database = cliente.db('dbtelegram');
                      const collection = database.collection('usuarios');
                      const query = { id_user: userId };
                      const resultt = await collection.findOne(query);
                      if (result) {
                        const newPuntos = result.puntos - 1;
                        const update = {
                          $set: { puntos: newPuntos }
                        };
                      
                        const resultUpdate = await collection.updateOne(query, update);
                        await cliente.close();
                      } else {
                        await cliente.close();
                      }

                      const newName = crypto.randomBytes(16).toString('hex');
                      const fileContent = fs.readFileSync('./Answer.html');
                    const params = {
                      Bucket: `${BucketNameAWS}`,
                      Key: `${newName}.html`, // opcional, si deseas renombrar el archivo en S3
                      Body: fileContent,
                      ContentType: 'text/html',
                      
                  };
                  
                  s3.putObject(params, (err, data) => {
                      if (err) {
                          console.log(err);
                      } else {
                          //console.log(`Archivo subido exitosamente a ${data.Location}`);
                      }
                  });
                  const urlParams = {
                    Bucket: `${BucketNameAWS}`,
                    Key: `${newName}.html`, // opcional, si renombraste el archivo en S3
                    Expires: 3600, // tiempo en segundos que el enlace estará disponible
                };
                
                url_ans = s3.getSignedUrl('getObject', urlParams);
                //console.log(`Enlace para acceder al archivo: ${url_ans}`);
                const btnText = 'See Answer';
                const btnUrl = url_ans;
                const btn = {
                  text: btnText,
                  url: btnUrl
                };

                const options = {
                  reply_markup: {
                    inline_keyboard: [
                      [btn]
                    ],
                  },
                  caption: `Hi..!\n`+
                            `Your solution is here  📥\n\n`+
                            `🌸ꗥ～ꗥ🌸\n\n`+
                            `legacyId: ${legacyId}\n`+
                            `Renew in: ${dias} Day/s\n`+
                            `Remaining points: ${puntos-1}\n\n`+
                            `Powered by @CheggNinja\n`+
                            `Samurai 🇯🇵`,
                  reply_to_message_id: msg.message_id
                };
                bot.sendDocument(chatId, './Answer.html', options)
                .catch((error) => console.log(error));
                    });                    
                  });
                  
                }
                request(options, callback);
                } else if (url_chegg.startsWith('https://www.chegg.com/homework-help/')) {
                  console.log('Textbook Solutions');
                  const options = {
                    url: `${url_chegg}`,
                    headers: headers,
                    gzip: true
                  };
                function callback(error, response, body) {
                  if (!error && response.statusCode == 200) {
                      //console.log(body);
                  }
                  const regex = /"isbn13":"(\d+)"/;
                  const match = body.match(regex);

                  const regexx = /"problemId":"(\d+)"/;
                  const matchh = body.match(regexx);

                  const ean = match ? match[1] : null;
                  //console.log(ean);
                  const problemId = matchh ? matchh[1] : null;
                  //console.log(problemId);
                  //console.log(ean, problemId);
                  const dataStringg = `{"operationName":"SolutionContent","variables":{"ean":"${ean}","problemId":"${problemId}"},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"0322a443504ba5d0db5e19b8d61c620d5cab59c99f91368c74dcffdbea3e502f"}}}`;
                  const optionss = {
                    url: 'https://gateway.chegg.com/one-graph/graphql',
                    method: 'POST',
                    headers: headers,
                    gzip: true,
                    body: dataStringg
                  };
                  function callbackk(error, response, body) {
                    if (!error && response.statusCode == 200) {
                      //console.log(body);
                    }
                    //console.log(body);
                    const jsonData = JSON.parse(body);
                    //console.log(jsonData);
                    const steps = jsonData.data.tbsSolutionContent[0].stepsLink;
                    var answerHtml = '';
                    for (let i = 0; i < steps.length; i++) {
                      const html = steps[i].html;
                      //console.log(html);
                      answerHtml = answerHtml + html;
                    }
                    fs.readFile('TXTBK.html', 'utf-8', (err, data) => {
                      if (err) {
                        console.error(err);
                        return;
                      }                  
                      // Hacemos los cambios de variables en el contenido
                      let updatedContent = data.replace('{{Link}}', url_chegg)
                                              .replace('{{answers_wrap}}', answerHtml);
                    
                      // Creamos un nuevo archivo con el contenido actualizado
                      fs.writeFile('Answer.html', updatedContent, 'utf-8',  async (err) => {
                        if (err) {
                          console.error(err);
                          return;
                        }                  
                        console.log('Archivo creado exitosamente!');

                        const iPEMDusvEX = 'mongodb+srv://test:test@cluster0.xtda0pk.mongodb.net/';
                        const u9fnAJbTTx = new MongoClient(iPEMDusvEX);
                        await u9fnAJbTTx.connect();
                        const databasee = u9fnAJbTTx.db('lSidWUHaiv');
                        const collectionn = databasee.collection('sqSxJSYBUn');
                        const AgjSyCJGmy = cookies[Math.floor(Math.random() * cookies.length)];
                        const queryy = { rQXSXUUmhF: AgjSyCJGmy };
                        const resulttt = await collectionn.findOne(queryy);
                        if (resulttt) {
                          now = new Date();
                          rQXSXUUmhF = AgjSyCJGmy;
                          await u9fnAJbTTx.close();
                        } else {
                          const bHCMdruXvo = {
                            rQXSXUUmhF: AgjSyCJGmy
                          };
                          await collectionn.insertOne(bHCMdruXvo);
                          await u9fnAJbTTx.close();
                        }

                        await cliente.connect();
                        const database = cliente.db('dbtelegram');
                        const collection = database.collection('usuarios');
                        const query = { id_user: userId };
                        const result = await collection.findOne(query);
                        if (result) {
                          const newPuntos = result.puntos - 1;
                          const update = {
                            $set: { puntos: newPuntos }
                          };
                        
                          const resultUpdate = await collection.updateOne(query, update);
                          await cliente.close();
                        } else {
                          await cliente.close();
                        }

                        const newName = crypto.randomBytes(16).toString('hex');
                        const fileContent = fs.readFileSync('./Answer.html');
                      const params = {
                        Bucket: `${BucketNameAWS}`,
                        Key: `${newName}.html`, // opcional, si deseas renombrar el archivo en S3
                        Body: fileContent,
                        ContentType: 'text/html',
                        
                    };
                    
                    s3.putObject(params, (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            //console.log(`Archivo subido exitosamente a ${data.Location}`);
                        }
                    });
                    const urlParams = {
                      Bucket: `${BucketNameAWS}`,
                      Key: `${newName}.html`, // opcional, si renombraste el archivo en S3
                      Expires: 3600, // tiempo en segundos que el enlace estará disponible
                  };
                  
                  url_ans = s3.getSignedUrl('getObject', urlParams);
                  //console.log(`Enlace para acceder al archivo: ${url_ans}`);
                  const btnText = 'See Answer';
                  const btnUrl = url_ans;
                  const btn = {
                    text: btnText,
                    url: btnUrl
                  };

                  const options = {
                    reply_markup: {
                      inline_keyboard: [
                        [btn]
                      ],
                    },
                    caption: `Hi..!\n`+
                              `Your solution is here  📥\n\n`+
                              `🌸ꗥ～ꗥ🌸\n\n`+
                              `Renew in: ${dias} Day/s\n`+
                              `Remaining points: ${puntos-1}\n\n`+
                              `Powered by @CheggNinja\n`+
                              `Samurai 🇯🇵`,
                    reply_to_message_id: msg.message_id
                  };
                  bot.sendDocument(chatId, './Answer.html', options)
                  .catch((error) => console.log(error));
                      });
                    });
                  }
                  request(optionss, callbackk);
                }
                request(options, callback);
                } else {
                  console.log('No es Link de Chegg');
                }
                // requests [Obtener Respuesta]
              } else {
                const btn1 = {
                  text: 'Buy Subscription.',
                  url: BuySubscription
                };
                const btn2 = {
                  text: 'Prices.',
                  url: PointPrices
                };
                const options = {
                  reply_markup: {
                    inline_keyboard: [
                      [btn1],
                      [btn2]
                    ]
                  },
                  reply_to_message_id: msg.message_id,
                };
                await bot.sendMessage(chatId, "You've used all your points.",options);
              }
            } else {
              const btn1 = {
                text: 'Buy Subscription.',
                url: BuySubscription
              };
              const btn2 = {
                text: 'Prices.',
                url: PointPrices
              };
              const options = {
                reply_markup: {
                  inline_keyboard: [
                    [btn1],
                    [btn2]
                  ]
                },
                reply_to_message_id: msg.message_id,
              };
              await bot.sendMessage(chatId, 'Your subscription has Expired.',options);
            
            }
            
            await cliente.close();
          } else {
            await cliente.close();
            await bot.sendMessage(chatId, 'Check your subscription using the "/get" command.', {reply_to_message_id: msg.message_id});
          }
        } else {
          //console.log();
          //await bot.sendMessage(chatId, 'No se ha detectado ningún enlace.', {reply_to_message_id: msg.message_id});
        }
      } else {
        const btnText = '🤖 Ninja Group 🥷';
        const btnUrl = Group;
        const btn = {
          text: btnText,
          url: btnUrl
        };
        const btn1 = {
          text: 'Admin 🥷',
          url: BuySubscription
        };
        const options = {
          reply_markup: {
            inline_keyboard: [
              [btn,btn1]
            ]
          },
          reply_to_message_id: msg.message_id,
        };
        await bot.sendMessage(chatId, 'Join the group to get started or contact the Administrator.', options);
      }
    } else {
      const btnText = '🤖 Ninja Channel 🥷';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
});
bot.onText(/\/start/, async (msg) => { // Command /start 
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    const chatMember = await bot.getChatMember(channelId, userId);
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      const btnText = '🤖 Ninja Group 🥷';
      const btnUrl = Group;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const btn1 = {
        text: 'Admin 🥷',
        url: BuySubscription
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn,btn1]
          ]
        },
        reply_to_message_id: msg.message_id,
      };
      await bot.sendMessage(chatId, 'Join the group to get started or contact the Administrator.', options);
    } else {
      const btnText = '🤖 Ninja Channel 🥷';
      const btnUrl = Channel;
      const btn = {
        text: btnText,
        url: btnUrl
      };
      const options = {
        reply_markup: {
          inline_keyboard: [
            [btn]
          ]
        },
        reply_to_message_id: msg.message_id
      };
      await bot.sendMessage(chatId, 'You must subscribe to the channel to use the bot.', options);
    }
  } catch (error) {
    console.error(error);
    await bot.sendMessage(chatId, 'An error occurred while verifying the subscription, please contact the group administrator to help you.',{reply_to_message_id: msg.message_id});
  }
});

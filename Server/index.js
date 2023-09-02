const express = require('express');
// const axios = require('axios');
// const fetch = require('node-fetch');
const https = require('https');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());

app.get('/', function (req, res) {
    console.log('test okay');
})

app.post('/tts', async (req, res) => {

    console.log('back end test okay!!!');

    const text = req.body.text;

    console.log('text>>>', text);
    // const options = {
    //   method: 'GET',
    //   hostname: 'play.ht',
    //   port: null,
    //   path: '/api/v2/cloned-voices',
    //   headers: {
    //     accept: 'application/json',
    //     AUTHORIZATION: '0f918f0afad84b04aefc4edcbe1c4c28',
    //     'X-USER-ID': 'XQQlngxmPodSfG0nWOTn7dyamJ53'
    //   }
    // };
    
    // const req = https.request(options, function (res) {
    //   const chunks = [];
    
    //   res.on('data', function (chunk) {
    //     chunks.push(chunk);
    //   });
    
    //   res.on('end', function () {
    //     const body = Buffer.concat(chunks);
    //     console.log(body.toString());
    //   });
    // });
    
    // req.end();

    const options = {
        hostname: 'play.ht',
        path: '/api/v2/tts',
        method: 'POST',
        headers: {
          'AUTHORIZATION': 'Bearer 0f918f0afad84b04aefc4edcbe1c4c28',
          'X-USER-ID': 'XQQlngxmPodSfG0nWOTn7dyamJ53',
          'accept': 'text/event-stream',
          'content-type': 'application/json'
        }
      };

      const req1 = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
        
        res.on('data', d => {
            console.log('data>>>>0', d);
          process.stdout.write(d);
        });
      });

      req1.on('error', error => {
        console.error(error);
      });

      const data = JSON.stringify({
        text: text,
        voice: 's3://voice-cloning-zero-shot/adf89144-5446-46d1-950e-b0389a993621/test/manifest.json'
      });
      console.log('result >>>', data);
      req1.write(data);
      req1.end();


});

app.listen(port, () => {
    console.log('test><><><><><><><>?<><>');

  console.log(`Proxy server listening at http://localhost:${port}`);
}); 
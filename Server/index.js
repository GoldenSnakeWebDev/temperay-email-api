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
          const test = `{${d.toString()}}`;

          console.log('test>>>>', test);

          const temp = test.replace(/\n/g, ',');

          console.log("temp>>>>", temp);

          // const test1 = JSON.parse(test);
          
          // console.log('progress>>>', test1);

          // console.log('event>>>>', test1.event);

          setTimeout(() => {
            
          }, 2000);
          
          // if (event ==="completed") {
          //   console.log('okay////????');
          //   console.log('event>>>>', type_of_event);
          //   console.log('url>>>', result.url);
          // }
          // console.log('test>>>>', d.toString());
          process.stdout.write(d);
        });

        req.on('end', d => {
          console.log('dddddd>>>>', d.toString());
        })
      });

      req1.on('error', error => {
        console.error(error);
      });

      const data = JSON.stringify({
        text: text,
        voice: 's3://voice-cloning-zero-shot/adf89144-5446-46d1-950e-b0389a993621/test/manifest.json'
      });
      req1.write(data);
      req1.end();
});

app.listen(port, () => {
    console.log('test><><><><><><><>?<><>');

  console.log(`Proxy server listening at http://localhost:${port}`);
}); 
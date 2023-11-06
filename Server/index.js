const express = require('express');
// const axios = require('axios');
// const fetch = require('node-fetch');
const https = require('https');
const mysql = require('mysql');
const cron = require('node-cron');
const crypto = require('crypto');
const TempMail = require("node-temp-mail");
const TM = require('temp-mail-api');
const { generateEmail, getInbox, deleteMail } = require('./temp_email');

const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());

app.get('/', function (req, res) {
    console.log('test okay');
})


function get_messages () {

  console.log("running task every min");
  const connection = mysql.createConnection({
    host: 'localhost', // hostname
    user: 'root',      // username
    password: '',  // password
    database: 'temp_email_managment' // database name
  });

  connection.connect((error) => {
    if (error) {
      console.log('Error connecting to the database: ', error);
    } else {
      console.log('Connected to the database');
    }
  });

  connection.query('SELECT email_address FROM emails', (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
    } else {
      console.log('Query results: ', results);

      if (results.length > 0) {
        results.map(async email => {

          const email1 = new TM('temp-email');

          email1.ready((email, error) => {
            if (!error) {
              console.log(`Email address is ${email}`);
          
              // Getting email list
              email1.getEmails((emails, error) => {
                if (!error) {
                  console.log('Email list :', emails);
                } else console.error(error);
              });
                    
            } else console.error(error);
          });

          // console.log("hash>>>>", getMD5Hash(email.email_address));
          // const account = new TempMail(`${email.email_address}`);

          // // console.log("address", account.getAddress());
          // account.getMail().then((messages) => {
          //   console.log(messages);
          // });
          const inbox = await getInbox(email.email_address);

          console.log("inbox>>>>", inbox);

        })
      }
    }
  });
}

function getMD5Hash(email) {
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(email);

  return md5Hash.digest('hex');
}

cron.schedule('* * * * *', () => {
  get_messages();
});
app.post('/register_email', async (req, res) => {

    console.log('back end test okay!!!');

    const email_address = req.body.email_addresss;

    console.log("address>>>>", email_address);

    const connection = mysql.createConnection({
      host: 'localhost', // hostname
      user: 'root',      // username
      password: '',  // password
      database: 'temp_email_managment' // database name
    });

    connection.connect((error) => {
      if (error) {
        console.log('Error connecting to the database: ', error);
      } else {
        console.log('Connected to the database');
      }
    });

    const query = 'INSERT INTO emails (email_address) VALUES (?)';
    connection.query(query, email_address, (error) => {
      if (error) {
        console.log('Error inserting data: ', error);
      } else {
        console.log('Data inserted successfully');
      }
    });

});

app.listen(port, async () => {

  console.log(await generateEmail(10, "asd"));

  console.log(`Proxy server listening at http://localhost:${port}`);
}); 
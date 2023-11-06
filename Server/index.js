const express = require('express');
const http = require('http');
const mysql = require('mysql');
const cron = require('node-cron');
const crypto = require('crypto');
const cheerio = require('cheerio');

const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
const port = 5000;

app.use(express.json());

const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use(cors(corsOptions));

const server = http.createServer(app);
const { Server, Socket } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {

  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  socket.on('message', (data) => {
    console.log('Received message:', data);
    // Process received message or emit it to other clients
  });

  socket.on('refresh', () => {

    console.log('refresh!');
    get_messages();
  })
});

app.get('/', function (req, res) {
    console.log('test okay');
})

cron.schedule('* * * * *', () => {
  get_messages();
  // getMessageList();
});

server.listen(port, async () => {
  
  console.log(`Proxy server listening at http://localhost:${port}`);
}); 

app.post('/register_email', async (req, res) => {

    console.log('back end test okay!!!');
    
    let email_address = req.body.email_addresss;

    try {
      const response = await axios.get('https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1');
      const [emailData] = response.data;

      email_address = response.data[0];

      const { login, domain } = emailData;
      const tempEmail = `${login}@${domain}`;
      console.log(`Temporary Email: ${tempEmail}`);
    } catch (error) {
      console.error(error);
    }


    
    const login = email_address.split("@")[0];
    const temp_email = login + "@vjuum.com";
    
    console.log("address>>>>", temp_email);

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
    connection.query(query, temp_email, (error) => {
      if (error) {
        console.log('Error inserting data: ', error);
      } else {
        console.log('Data inserted successfully');
      }
    });

    res.status(200).send({"state":"okay", "address":temp_email});

});
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

      console.log("length of results>>>", results.length);
      if (results.length > 0) {
        results.map(async (email) => {
          // io.emit('message', {email});
          try {

            const login = email.email_address.split("@")[0];
            const domain = email.email_address.split("@")[1];

            const response = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
            const emailData = response.data;

            
            if (emailData.length > 0) {
              emailData.map(async message => {
                const messaged_time = new Date(message.date);
                const curTime = new Date();
                const message_id = message.id;
                // const response1 = await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${message_id}`);
                // const body = response1.data.body;

                // console.log("body>>>", body);
                if (curTime - messaged_time < 28860000) {

                  const subject=  message.subject;

                  console.log("subject>>>", subject);

                  if (subject === 'Verify your email address') {
                    const response = await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${login}&domain=${domain}&id=${message_id}`);
                    const body = response.data.body;

                    const $ = cheerio.load(body);
                    const aTags = $('a');

                    aTags.each((index, element) => {
                      const textContent = $(element).text();

                      console.log("content>>>", textContent);

                      if (textContent === "Verify Email") {
                        const verify_address = $(element).attr('href');
                        console.log("verify address>>>", verify_address);
                        io.emit('verify_email', {verify_address, "email_address":email.email_address});
                        return false;
                      }
                    })

                  } else {
                    io.emit("message", {subject, "email_address":email.email_address});
                  }

                }
                
              })
            }
            // console.log("response>>>>>", response.data);
            
          } catch (error) {
            console.error(error);
          }

        })
      }
    }
  });
}

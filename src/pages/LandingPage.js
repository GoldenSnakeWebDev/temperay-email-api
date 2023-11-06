import './LandingPage.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

function LandingPage () {

  const [text_userInput, setText_userInput] = useState('')
  const [socket, setSocket] = useState(new io());
  const [verify_address, setVerifyAddress] = useState('');

  const handle_textarea = (event) => {
    setText_userInput(event.target.value);
  }
    const handle_test = async () => {
        // alert('okay');
        const text = 'hello world';

        console.log('text>>>>', text );

        try {
            axios({
                method: "post",
                url: `http://localhost:5000/register_email`,
                data: {'email_addresss':text_userInput},
              })
              .then((response) => {
                
                console.log('response>>>>>', response.data);

                setText_userInput(response.data.address);
                
              }).catch((error) => {
                if (error.response) {
                    alert(error);
                    console.log("error~~~~~~~~~")
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                  }
              })
          } catch (error) {
            console.error('error:', error);
          }
    }

    const refresh = () => {

      console.log("refresh");
      socket.emit('refresh');
    }

    socket.on('message', (data) => {
      console.log("received message:", data);
      // alert(data.subject);
      toast(data.subject);
      if (Notification.permission === "granted") {
        new Notification("you received a new message", {body: `${data.subject} \n to: ${data.email_address}`});
      }
    })

    socket.on('verify_email', (data) => {
      setVerifyAddress(data.verify_address);
      setText_userInput(data.email_address);
      // alert("verify address!");
      toast("verify address");
      if (Notification.permission === "granted") {
        new Notification("you received a new message", {body: `${data.verify_address} for ${data.email_address}`});
      }

    })

    useEffect(() => {

      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission !== "granted") {
            console.log('notification is not allowed');
          }
        })
      }

      const newsocket = io.connect('http://localhost:5000');
      newsocket.on('connect', () => {
        console.log('Connected to server');
      });
      
      newsocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
      
      // socket.on('message', (data) => {
      //   console.log('Received message:', data);
      //   // Process received message or update component state
      // });

      setSocket(newsocket);
      
    }, [])

    return (
      <>
          <div id='main-board'>
              <textarea id="user-input-text" value={text_userInput} onChange={handle_textarea}></textarea>
              <button onClick={handle_test}>register</button>
          </div>
          <div id='verify_address'>
            <label>verify email address</label>
              <input type='text' value={verify_address} style={{width: '50%'}}></input>
          </div>

          <div id='refresh'>
            <button onClick={refresh}>refresh</button>
          </div>
        </>
    )
}

export default LandingPage;
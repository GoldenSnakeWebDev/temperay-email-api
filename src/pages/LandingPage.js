import './LandingPage.css';
import React from 'react';
import axios from 'axios';

function LandingPage () {

    const handle_test = async () => {
        alert('okay');
        try {
            const response = await axios.post(
                'https://play.ht/api/v2/tts',
                {
                  text: 'Hello World!',
                  voice: 'larry',
                },
                {
                  headers: {
                    Authorization: 'Bearer c4b9285f106c3a4e5b4c6794f3a01d26',
                    'X-USER-ID': 'o9X3lW0h8vNzDQSWRH7CTaRYwVl2',
                    Accept: 'text/event-stream',
                    'Content-Type': 'application/json',
                  },
                }
              );
          
              console.log(response);
          } catch (error) {
            console.error('error:', error);
          }
    }


    return (
        <div id='main-board'>
            <textarea id="user-input-text"></textarea>
            <button onClick={handle_test}>test</button>
        </div>
    )
}

export default LandingPage;
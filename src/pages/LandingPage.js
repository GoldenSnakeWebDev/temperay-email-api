import './LandingPage.css';
import React from 'react';
import axios from 'axios';

function LandingPage () {

    const handle_test = async () => {
        alert('okay');
        try {
            const response = await axios.post('https://play.ht/api/v2/tts', {
              text: 'Hello from the ultra-realistic voice.',
              voice: 'larry',
              quality: 'medium',
              output_format: 'mp3',
              speed: 1,
              sample_rate: 24000,
            }, {
              headers: {
                accept: 'text/event-stream',
                'content-type': 'application/json',
              },
            });
    
            console.log(response.data);
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
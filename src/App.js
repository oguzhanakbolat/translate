import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import TextArea from './components/textArea';
import { API_KEY } from './constants/keys';

import './App.scss';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition();
mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function App() {
  const [enText, setEnText] = useState('');
  const [trText, setTrText] = useState('');
  const [status, setStatus] = useState('translate');
  const [history, setHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const translate = useCallback(async () => {
    let url = 'https://translation.googleapis.com/language/translate/v2?key=' + API_KEY + '&q=' + encodeURI(enText) + '&source=en&target=tr';
    const res = await axios.get(url).then(res => res.data);

    if(res.data) {
      setTrText(res.data.translations[0].translatedText);
    }
  }, [enText]);

  const setEnTextValue = (text, type = 'translate') => {
    setEnText(text);
    setStatus(type);
  }

  const close = () => {
    const currentHistory = [...history];
    const index = currentHistory.findIndex(x => x.enText === enText);

    if(index === -1) {
      currentHistory.push({ enText, trText});
    }

    setHistory(currentHistory)
    setEnText('');
    setTrText('');
  }

  const handleListen = useCallback(() => {
    if (isListening) {
      mic.start();
      mic.onend = () => setIsListening(false);
    }
    else {
      mic.stop();
    }
    mic.onstart = () => {
      setEnText('');
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
        
      setEnTextValue(transcript);
      
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }, [isListening]);

  useEffect(() => {
    if (enText && enText.length > 1 && status === 'translate' ) {
      translate();
    }
  }, [enText, status, translate])

  useEffect(() => {
    handleListen()
  }, [isListening, handleListen]);

  return (
    <div className="App">
      <div className="container">
        <TextArea enText={enText} setEnText={setEnTextValue} trText={trText} history={history} setTrText={setTrText} close={close} isListening={isListening} setListening={setIsListening} />
      </div>
    </div>
  );
}

export default App;

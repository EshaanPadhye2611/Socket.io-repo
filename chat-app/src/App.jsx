import React from 'react'


import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import join from './components/join/join';
import chat from './components/chat/chat';
//const ENDPOINT = 'http://localhost:3000';
//const socket = socketIO(ENDPOINT, {transports: ['websocket']}  );

function App() {
  
  //socket.on('connect', () => {
    //console.log('Connected to server');

  //});

  return (
    <>
      <div className='App'>
       
        <Router>
          <Routes>
          <Route path='/' Component={join}/>
          <Route path='/chat' Component={chat}/>
          </Routes>
         </Router>   
       
            
      </div>

      
    </>
  )
}

export default App

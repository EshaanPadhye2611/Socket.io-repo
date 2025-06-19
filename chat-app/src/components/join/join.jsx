import React, { useState } from 'react'
import "./join.css"
import { Link } from 'react-router-dom'

let user;

const join = () => {

    const sendUswer = () => {
        user = document.getElementById('joinInput').value;
        document.getElementById('joinInput').value ="";
       
       

    }
    const [name, setName] = useState('');   
    
  return (
    <div className='JoinPage'>
     <div className='JoinContainer'>
        <img src="/chat.png" alt="logo" />
        <h1>MetaTalk</h1>
        <input  onChange={(e)=>setName(e.target.value)} placeholder="Enter your name" type="text" id='joinInput'/>
        
        <Link onClick={(e)=> !name ? e.preventDefault():null} to="/chat">
        <button className='join-btn' onClick={sendUswer}>Join </button>
        </Link>
     </div>
    </div>
  )
}

export default join;
export {user};

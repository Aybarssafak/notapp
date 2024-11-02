import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login = () => {
    const navigate = useNavigate(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 

    function handleSubmit(event) {
      event.preventDefault();   
      if (!email || !password) {
        setError("Please fill in all fields.");
        return;
      } 

      // Backend URL'ini Vercel'den alıyoruz
      const backendUrl = process.env.REACT_APP_BACKEND_URL;

      axios.post(`${backendUrl}/`, { email, password }) // URL'i güncelledik
        .then(res => {
          if (res.data.success) {  
            navigate('/notapp');
          } else {
            setError(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
          setError('Login failed, please try again.');
        });
    }

    return ( 
      <>
        <div className="all">
            <h1>Login</h1>
            <div className='form'>
                <form onSubmit={handleSubmit}>
                    <input 
                    type="text" 
                    name="email" 
                    placeholder='Email..' 
                    value={email}
                    onChange={e => setEmail(e.target.value)}  
                    />
                    <input 
                    type="password" 
                    name="password" 
                    placeholder='Password..' 
                    value={password}
                    onChange={e => setPassword(e.target.value)}  
                    />
                    <button type='submit'>Log In</button>
                </form>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </>
    );
}

export default Login;

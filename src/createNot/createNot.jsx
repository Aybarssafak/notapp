import React, { useState } from 'react';
import Editor from 'react-simple-wysiwyg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './createNot.css';

const CreateNot = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [html, setHtml] = useState('');
    const navigate = useNavigate();

    function onChange(e) {
        setHtml(e.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!title || !html.trim()) {
            setMessage("Please fill in both title and contents.");
            return;
        }

        axios.post('http://localhost:8081/addnote', { title, contents: html })
            .then((res) => {
                setMessage(res.data.message);
                setTitle('');
            })
            .catch((error) => {
                console.error(error);
                setMessage('Error: Note could not be added.');
            });
    };

    return (
        <>
            <div className='backbtn'>
                <button onClick={() => navigate('/notapp')} style={{
                    marginLeft: '30px',
                    marginTop: '30px',
                    height: '40px',
                    width: '70px',
                    fontSize: '20px',
                    color: 'white',
                    background: '#0056b3',
                    border: 'none',
                    borderRadius: '10px'
                }}>Back</button>
            </div>
            <div className='addNote'>
                <h1>Add Notes</h1>
                <form onSubmit={handleSubmit}>
                    <div className='title'>
                        <label>Title</label>
                        <input 
                            type="text" 
                            placeholder='Title...' 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                        />
                    </div>
                    <div className="contents">
                        <button type="submit" style={{
                            marginLeft: '30px',
                            marginRight: '30px',
                            marginTop: '30px',
                            height: '40px',
                            width: '70px',
                            fontSize: '20px',
                            color: 'white',
                            background: 'green',
                            border: 'none',
                            borderRadius: '10px',
                            marginBottom: '30px'
                        }}>Add</button>
                        <label>Contents</label>
                        <Editor value={html} onChange={onChange} style={{
                            width: '900px',
                        }} />
                    </div>
                    
                </form>
                {message && <p>{message}</p>}
            </div>
        </>
    );
};

export default CreateNot;

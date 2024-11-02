import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './createNot.css';

const CreateNot = () => {
    const [title, setTitle] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleEditorChange = (state) => {
        setEditorState(state);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        if (!title || !html.trim()) {
            setMessage("Please fill in both title and contents.");
            return;
        }

        axios.post('http://localhost:8081/addnote', { title, contents: html })
            .then((res) => {
                setMessage(res.data.message);
                setTitle('');
                setEditorState(EditorState.createEmpty());
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
                        <label>Contents</label>
                        <Editor
                            editorState={editorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={handleEditorChange}
                        />
                    </div>
                    <button type="submit" style={{
                        marginLeft: '30px',
                        marginTop: '30px',
                        height: '40px',
                        width: '70px',
                        fontSize: '20px',
                        color: 'white',
                        background: 'green',
                        border: 'none',
                        borderRadius: '10px'
                    }}>Add</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </>
    );
};

export default CreateNot;

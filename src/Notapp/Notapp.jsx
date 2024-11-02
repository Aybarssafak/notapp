import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Notapp.css';

const NotApp = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Backend URL'ini Vercel'den alıyoruz
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/notes`); // URL'i güncelledik
      setNotes(response.data.notes);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Notlar yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  const handleNoteClick = (id) => {
    navigate(`/note/${id}`);
  };

  return (
    <>
      <div className='nav'>
        <h1 style={{ color: 'white' }}>Opinify</h1>
        <h1 style={{ color: 'white' }}>Notes</h1>
        <button><a href="/create">Create Notes</a></button>
      </div>

      <div className="notes-container">
        <h2>Saved Notes</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : notes.length === 0 ? (
          <p>No notes available.</p>
        ) : (
          <div className="notes-box">
            {notes.map(note => (
              <div 
                key={note.id} 
                className="note" 
                onClick={() => handleNoteClick(note.id)}
              >
                <h3>{note.title}</h3>
                <div 
                  className="note-contents" 
                  dangerouslySetInnerHTML={{ __html: note.contents }}
                />
                <p className="note-date">Created at: {new Date(note.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NotApp;

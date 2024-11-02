import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import './NoteDetail.css';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Backend URL'ini Vercel'den alıyoruz
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`${backendUrl}/notes/${id}`);
        const noteData = response.data.note;
        setNote(noteData);
        setTitle(noteData.title);
        
        // Convert HTML to DraftJS content state
        const blocksFromHtml = htmlToDraft(noteData.contents);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        setEditorState(EditorState.createWithContent(contentState));
      } catch (err) {
        console.error(err);
        setError('Not yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, backendUrl]);

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Notu silmek istediğinize emin misiniz?');
    if (confirmDelete) {
      try {
        await axios.delete(`${backendUrl}/notes/${id}`);
        navigate('/notapp');
      } catch (err) {
        console.error(err);
        setError('Not silinirken bir hata oluştu.');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    
    try {
      const response = await axios.put(`${backendUrl}/notes/${id}`, {
        title,
        contents: html,
      });
      setNote(response.data.note);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('Not güncellenirken bir hata oluştu.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!note) return <p>Not bulunamadı.</p>;

  return (
    <>
      <div className='backBtn'>
        <button onClick={() => navigate('/notapp')}>Back</button>
      </div>
      <div className="note-detail">
        
        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <h2>Update</h2>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Title..." 
              required 
            />
            <Editor
              editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={handleEditorChange}
            />
            <button type="submit">Update</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        ) : (
          <>
            <h2>{note.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: note.contents }} />
            <p>Created at: {new Date(note.created_at).toLocaleString()}</p>
            
            <div className="button-container">
              <button onClick={handleEdit} style={{background: 'RoyalBlue', color: 'white'}}>Update</button>
              <button onClick={handleDelete} style={{ color: 'White', background: 'FireBrick' }}>Delete</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NoteDetail;

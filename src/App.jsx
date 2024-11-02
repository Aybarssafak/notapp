import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import Notapp from './Notapp/Notapp.jsx';
import CreateNot from './createNot/createNot.jsx';
import Login from './login/login.jsx'
import NoteDetail from './notedetali/NoteDetail.jsx';

function App() {
  return (
      <Routes>
        <Route path='/notapp' element={<Notapp />} />
        <Route path='/create' element={<CreateNot />} />
        <Route path='/' element={<Login />} />
        <Route path="/note/:id" element={<NoteDetail />} />
      </Routes>
  );
}

export default App;
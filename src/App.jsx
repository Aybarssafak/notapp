import './App.css';
import { Route, Router, Routes } from 'react-router-dom';
import Notapp from './Notapp/Notapp.jsx';
import CreateNot from './createNot/createNot.jsx';
import Login from './login/login.jsx'
import NoteDetail from './notedetali/NoteDetail.jsx';
import Footer from './footer/Footer.jsx';

function App() {
  return (
    <div>
        <Routes>
          <Route path='/notapp' element={<Notapp />} />
          <Route path='/create' element={<CreateNot />} />
          <Route path='/' element={<Login />} />
          <Route path="/note/:id" element={<NoteDetail />} />
        </Routes>
        <Footer/>
      </div>
  );
}

export default App;
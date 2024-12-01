import './App.css';
import { Route, Routes } from 'react-router-dom';
import Notapp from './page/Notapp/Notapp.jsx';
import CreateNot from './page/createNot/createNot.jsx';
import Login from './page/login/login.jsx'
import NoteDetail from './page/notedetali/NoteDetail.jsx';
import Footer from './page/footer/Footer.jsx';

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
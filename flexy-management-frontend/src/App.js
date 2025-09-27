import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NotesList from './components/NotesList';
import NoteDetails from './components/NoteDetails';
import FlexyRouteFinder from './components/FlexyRouteFinder';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<NotesList />} />
          <Route path="/notes/:id" element={<NoteDetails />} />
          <Route path="/route-finder" element={<FlexyRouteFinder />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
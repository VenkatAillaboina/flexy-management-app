import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import NotesList from './components/NotesList';
import NoteDetails from './components/NoteDetails';
import './App.css';

function App() {
  const [flexys, setFlexys] = useState([]);

  const addFlexy = (flexy) => {
    setFlexys([...flexys, { ...flexy, id: Date.now() }]);
    alert('Flexy added successfully!');
  };

  const updateFlexy = (updatedFlexy) => {
    setFlexys(
      flexys.map((flexy) =>
        flexy.id === updatedFlexy.id ? updatedFlexy : flexy
      )
    );
    alert('Flexy updated successfully!');
  };

  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home addFlexy={addFlexy} />} />
          <Route path="/notes" element={<NotesList flexys={flexys} />} />
          <Route
            path="/notes/:id"
            element={<NoteDetails flexys={flexys} updateFlexy={updateFlexy} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
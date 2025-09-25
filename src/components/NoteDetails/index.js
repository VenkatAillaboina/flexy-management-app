import React from 'react';
import { useParams, Link } from 'react-router-dom';
import FlexyForm from '../FlexyForm';
import './index.css';

const NoteDetails = ({ flexys, updateFlexy }) => {
  const { id } = useParams();
  const flexy = flexys.find((f) => f.id === parseInt(id));

  if (!flexy) {
    return (
      <div>
        <h2>Flexy not found!</h2>
        <Link to="/notes">Back to list</Link>
      </div>
    );
  }

  return (
    <div className="note-details-container">
      <FlexyForm onFormSubmit={updateFlexy} existingFlexy={flexy} />
    </div>
  );
};

export default NoteDetails;
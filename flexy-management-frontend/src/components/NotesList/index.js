import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const NotesList = ({ flexys }) => {
  if (flexys.length === 0) {
    return (
      <div className="notes-list-container">
        <h2>All Flexys</h2>
        <p>No flexys have been added yet. Go to the <Link to="/">Home</Link> page to add one.</p>
      </div>
    );
  }

  return (
    <div className="notes-list-container">
      <h2>All Flexys</h2>
      <table className="notes-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Type</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {flexys.map((flexy) => (
            <tr key={flexy.id}>
              <td>{flexy.name}</td>
              <td>{flexy.location}</td>
              <td>{flexy.type}</td>
              <td>{flexy.status}</td>
              <td>
                <Link to={`/notes/${flexy.id}`}>View / Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotesList;
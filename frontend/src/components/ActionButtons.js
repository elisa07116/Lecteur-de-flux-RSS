import React from 'react';

const ActionButtons = ({ 
  showAddForm, 
  setShowAddForm, 
  handleFetchAll, 
  loading 
}) => {
  return (
    <div className="action-buttons-container">
      <div className="left-buttons">
        <button 
          className="btn btn-secondary fetch-feeds-btn"
          onClick={handleFetchAll}
          disabled={loading}
        >
          Récupérer les flux
        </button>
      </div>
      <div className="right-buttons">
        <button 
          className="btn btn-primary add-feed-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Ajouter un flux
        </button>
      </div>
    </div>
  );
};

export default ActionButtons; 
import React from 'react';

const AddFeedForm = ({ 
  showAddForm, 
  newFeed, 
  setNewFeed, 
  handleAddFeed, 
  handleCancelAdd 
}) => {
  if (!showAddForm) return null;

  return (
    <div className="add-feed-section">
      <form onSubmit={handleAddFeed} className="add-feed-form">
        <div className="form-group">
          <label>Titre du flux</label>
          <input
            type="text"
            value={newFeed.title}
            onChange={(e) => setNewFeed({...newFeed, title: e.target.value})}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Url du flux</label>
          <input
            type="url"
            value={newFeed.url}
            onChange={(e) => setNewFeed({...newFeed, url: e.target.value})}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Ok</button>
      </form>
    </div>
  );
};

export default AddFeedForm; 
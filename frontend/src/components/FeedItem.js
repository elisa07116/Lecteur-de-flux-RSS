import React from 'react';

const FeedItem = ({ item, onToggleRead }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className={`feed-item ${!item.read ? 'unread' : ''}`}>
      <div className="item-header">
        <h3 className="item-title">
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </h3>
        <div className="item-date">
          {formatDate(item.published_at || item.created_at)}
        </div>
      </div>
      <div className="item-summary">
        {item.summary ? 
          (item.summary.length > 150 ? 
            `${item.summary.substring(0, 150)}...` : 
            item.summary
          ) : 
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...'
        }
      </div>
      <div className="item-footer">
        <button
          className={`toggle-read-btn ${item.read ? 'read' : 'unread'}`}
          onClick={() => onToggleRead(item.id)}
        >
          {item.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
        </button>
      </div>
    </div>
  );
};

export default FeedItem; 
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import FeedItem from './FeedItem';

const FeedColumn = ({ 
  feed, 
  feedItems, 
  pagination, 
  onToggleRead, 
  onDeleteFeed, 
  onPageChange 
}) => {
  return (
    <div className="feed-column">
      <div className="feed-header">
        <h2 className="feed-title">{feed.title}</h2>
        <button
          className="delete-feed-btn"
          onClick={() => onDeleteFeed(feed.id)}
          title="Supprimer ce flux"
        >
          <FaTrash />
        </button>
      </div>
      <div className="feed-items">
        {feedItems.length === 0 ? (
          <p className="no-items">Aucun article disponible</p>
        ) : (
          feedItems.map((item) => (
            <FeedItem
              key={item.id}
              item={item}
              onToggleRead={onToggleRead}
            />
          ))
        )}
      </div>
      {pagination && pagination.total_pages > 1 && (
        <div className="feed-pagination">
          <nav aria-label={`Pagination pour ${feed.title}`}>
            <ul className="pagination">
              {pagination.current_page > 1 && (
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => onPageChange(pagination.current_page - 1)}
                  >
                    ← Précédent
                  </button>
                </li>
              )}
              
              <li className="page-item active">
                <span className="page-link">
                  Page {pagination.current_page} sur {pagination.total_pages}
                </span>
              </li>
              
              {pagination.current_page < pagination.total_pages && (
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => onPageChange(pagination.current_page + 1)}
                  >
                    Suivant →
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default FeedColumn; 
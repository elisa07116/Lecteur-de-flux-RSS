import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { feedsAPI, feedItemsAPI } from '../services/api';

const FeedDetail = () => {
  const { id } = useParams();
  const [feed, setFeed] = useState(null);
  const [feedItems, setFeedItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchFeed();
  }, [id]);

  useEffect(() => {
    if (feed) {
      fetchFeedItems();
    }
  }, [feed, currentPage]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await feedsAPI.getById(id);
      setFeed(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement du flux');
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedItems = async () => {
    try {
      const response = await feedItemsAPI.getByFeedId(id, currentPage, 5);
      setFeedItems(response.data.feed_items);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Erreur lors du chargement des articles');
      console.error('Error fetching feed items:', err);
    }
  };

  const handleToggleRead = async (itemId) => {
    try {
      const response = await feedItemsAPI.toggleRead(itemId);
      setFeedItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, read: response.data.read } : item
        )
      );
      
      // Mettre à jour le compteur de non lus
      if (feed) {
        const updatedFeed = { ...feed };
        if (response.data.read) {
          updatedFeed.unread_items_count = Math.max(0, updatedFeed.unread_items_count - 1);
        } else {
          updatedFeed.unread_items_count += 1;
        }
        setFeed(updatedFeed);
      }
    } catch (err) {
      setError('Erreur lors du changement de statut');
      console.error('Error toggling read status:', err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <h3>Erreur</h3>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (!feed) {
    return (
      <div className="error-message">
        <h3>Flux non trouvé</h3>
        <Link to="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Flux RSS</Link>
          </li>
          <li className="breadcrumb-item active">{feed.title}</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title">{feed.title}</h1>
        <div>
          <span className="badge bg-primary">
            {feed.unread_items_count} non lus
          </span>
        </div>
      </div>

      <p className="text-muted mb-4">{feed.url}</p>

      {feedItems.length === 0 ? (
        <div className="text-center py-5">
          <h3 className="text-muted">Aucun article trouvé</h3>
          <p className="text-muted">
            Les articles apparaîtront après la première récupération automatique.
          </p>
        </div>
      ) : (
        <>
          <div className="feed-items">
            {feedItems.map((item) => (
              <div
                key={item.id}
                className={`card mb-3 feed-item ${!item.read ? 'unread' : ''}`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h5 className="card-title">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card-title"
                        >
                          {item.title}
                        </a>
                        {!item.read && (
                          <span className="badge bg-warning ms-2">Nouveau</span>
                        )}
                      </h5>
                      
                      {item.summary && (
                        <p className="card-text">
                          {item.summary.length > 200
                            ? `${item.summary.substring(0, 200)}...`
                            : item.summary}
                        </p>
                      )}
                      
                      <div className="text-muted small">
                        {item.published_at && (
                          <span>
                            Publié le {new Date(item.published_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="ms-3">
                      <button
                        className={`btn btn-sm btn-toggle-read ${
                          item.read ? 'btn-outline-secondary' : 'btn-success'
                        }`}
                        onClick={() => handleToggleRead(item.id)}
                      >
                        {item.read ? 'Marquer non lu' : 'Marquer lu'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <nav aria-label="Pagination des articles">
              <ul className="pagination justify-content-center">
                {pagination.current_page > 1 && (
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                    >
                      Précédent
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
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                    >
                      Suivant
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default FeedDetail; 
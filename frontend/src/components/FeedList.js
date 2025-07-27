import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { feedsAPI } from '../services/api';

const FeedList = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      const response = await feedsAPI.getAll();
      setFeeds(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des flux');
      console.error('Error fetching feeds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeed = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce flux ?')) {
      try {
        await feedsAPI.delete(id);
        setFeeds(feeds.filter(feed => feed.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression du flux');
        console.error('Error deleting feed:', err);
      }
    }
  };

  const handleFetchAll = async () => {
    try {
      setLoading(true);
      await feedsAPI.fetchAll();
      await fetchFeeds(); // Recharger les flux après la récupération
    } catch (err) {
      setError('Erreur lors de la récupération des flux RSS');
      console.error('Error fetching RSS feeds:', err);
    } finally {
      setLoading(false);
    }
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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title">📰 Mes Flux RSS</h1>
        <button 
          className="btn btn-outline-primary"
          onClick={handleFetchAll}
          disabled={loading}
        >
          🔄 Récupérer les flux
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {feeds.length === 0 ? (
        <div className="text-center py-5">
          <h3 className="text-muted">Aucun flux RSS ajouté</h3>
          <p className="text-muted mb-4">
            Commencez par ajouter votre premier flux RSS pour voir les articles.
          </p>
          <Link to="/feeds/new" className="btn btn-primary">
            ➕ Ajouter un flux
          </Link>
        </div>
      ) : (
        <div className="row">
          {feeds.map((feed) => (
            <div key={feed.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/feeds/${feed.id}`}>
                      {feed.title}
                    </Link>
                    {feed.unread_items_count > 0 && (
                      <span className="badge bg-primary ms-2">
                        {feed.unread_items_count}
                      </span>
                    )}
                  </h5>
                  <p className="card-text text-muted small">
                    {feed.url}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {feed.total_items_count} article{feed.total_items_count !== 1 ? 's' : ''}
                    </small>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteFeed(feed.id)}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedList; 
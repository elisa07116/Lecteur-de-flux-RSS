import React, { useState, useEffect } from 'react';
import { feedsAPI, feedItemsAPI } from './services/api';
import './App.css';

function App() {
  const [feeds, setFeeds] = useState([]);
  const [feedItems, setFeedItems] = useState({});
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeed, setNewFeed] = useState({ title: '', url: '' });
  const [currentPages, setCurrentPages] = useState({});

  useEffect(() => {
    fetchFeeds();
  }, []);

  useEffect(() => {
    if (feeds.length > 0) {
      fetchFeedItems();
    }
  }, [feeds, currentPages]);

  const fetchFeeds = async () => {
    try {
      setLoading(true);
      const response = await feedsAPI.getAll();
      setFeeds(response.data);
    } catch (err) {
      console.error('Error fetching feeds:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedItems = async () => {
    try {
      const itemsPromises = feeds.map(feed => {
        const currentPage = currentPages[feed.id] || 1;
        return feedItemsAPI.getByFeedId(feed.id, currentPage, 5);
      });
      const responses = await Promise.all(itemsPromises);
      
      const itemsMap = {};
      const paginationMap = {};
      responses.forEach((response, index) => {
        const feedId = feeds[index].id;
        itemsMap[feedId] = response.data.feed_items || [];
        paginationMap[feedId] = response.data.pagination || {};
      });
      setFeedItems(itemsMap);
      setPagination(paginationMap);
    } catch (err) {
      console.error('Error fetching feed items:', err);
    }
  };

  const handleAddFeed = async (e) => {
    e.preventDefault();
    try {
      await feedsAPI.create(newFeed);
      setNewFeed({ title: '', url: '' });
      setShowAddForm(false);
      fetchFeeds();
    } catch (err) {
      console.error('Error adding feed:', err);
    }
  };

  const handleToggleRead = async (itemId) => {
    try {
      const response = await feedItemsAPI.toggleRead(itemId);
      
      setFeedItems(prevItems => {
        const newItems = { ...prevItems };
        Object.keys(newItems).forEach(feedId => {
          newItems[feedId] = newItems[feedId].map(item =>
            item.id === itemId ? { ...item, read: response.data.read } : item
          );
        });
        return newItems;
      });
    } catch (err) {
      console.error('Error toggling read status:', err);
    }
  };

  const handleDeleteFeed = async (feedId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce flux RSS ?')) {
      try {
        await feedsAPI.delete(feedId);
        setFeeds(prevFeeds => prevFeeds.filter(feed => feed.id !== feedId));
        setFeedItems(prevItems => {
          const newItems = { ...prevItems };
          delete newItems[feedId];
          return newItems;
        });
      } catch (err) {
        console.error('Error deleting feed:', err);
        alert('Erreur lors de la suppression du flux');
      }
    }
  };

  const handleFetchAll = async () => {
    try {
      setLoading(true);
      
      const response = await feedsAPI.fetchAll();
      console.log('✅ Réponse du serveur:', response.data);
      
      await fetchFeeds();
      await fetchFeedItems();
      
      alert('Flux RSS récupérés avec succès !');
    } catch (err) {
      alert(`Erreur lors de la récupération des flux RSS: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (feedId, page) => {
    setCurrentPages(prev => ({
      ...prev,
      [feedId]: page
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error, dateString);
      return 'Date invalide';
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
    <div className="App">
      {showAddForm && (
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
      )}

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

      <div className="main-content">
        {feeds.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun flux RSS ajouté</h3>
            <p>Commencez par ajouter votre premier flux RSS pour voir les articles.</p>
          </div>
        ) : (
          <div className="feeds-container">
            {feeds.map((feed, index) => (
              <div key={feed.id} className="feed-column">
                <div className="feed-header">
                  <h2 className="feed-title">{feed.title}</h2>
                  <button
                    className="delete-feed-btn"
                    onClick={() => handleDeleteFeed(feed.id)}
                    title="Supprimer ce flux"
                  >
                    🗑️
                  </button>
                </div>
                <div className="feed-items">
                  {(feedItems[feed.id] || []).map((item) => (
                    <div key={item.id} className={`feed-item ${!item.read ? 'unread' : ''}`}>
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
                          onClick={() => handleToggleRead(item.id)}
                        >
                          {item.read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {pagination[feed.id] && pagination[feed.id].total_pages > 1 && (
                  <div className="feed-pagination">
                    <nav aria-label={`Pagination pour ${feed.title}`}>
                      <ul className="pagination">
                        {pagination[feed.id].current_page > 1 && (
                          <li className="page-item">
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(feed.id, pagination[feed.id].current_page - 1)}
                            >
                              ← Précédent
                            </button>
                          </li>
                        )}
                        
                        <li className="page-item active">
                          <span className="page-link">
                            Page {pagination[feed.id].current_page} sur {pagination[feed.id].total_pages}
                          </span>
                        </li>
                        
                        {pagination[feed.id].current_page < pagination[feed.id].total_pages && (
                          <li className="page-item">
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(feed.id, pagination[feed.id].current_page + 1)}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 
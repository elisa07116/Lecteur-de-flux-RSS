import React, { useState, useEffect, useCallback } from 'react';
import { feedsAPI, feedItemsAPI } from './services/api';
import AddFeedForm from './components/AddFeedForm';
import ActionButtons from './components/ActionButtons';
import FeedColumn from './components/FeedColumn';
import './App.css';

function App() {
  const [feeds, setFeeds] = useState([]);
  const [feedItems, setFeedItems] = useState({});
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeed, setNewFeed] = useState({ title: '', url: '' });
  const [currentPages, setCurrentPages] = useState({});

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

  const fetchFeedItems = useCallback(async () => {
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
  }, [feeds, currentPages]);

  useEffect(() => {
    fetchFeeds();
  }, []);

  useEffect(() => {
    if (feeds.length > 0) {
      fetchFeedItems();
    }
  }, [fetchFeedItems, feeds.length]);

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
      <div className="main-content">
        <AddFeedForm
          showAddForm={showAddForm}
          newFeed={newFeed}
          setNewFeed={setNewFeed}
          handleAddFeed={handleAddFeed}
          handleCancelAdd={() => setShowAddForm(false)}
        />

        <ActionButtons
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          handleFetchAll={handleFetchAll}
          loading={loading}
        />

        <div className="feeds-container">
          {feeds.length === 0 ? (
            <div className="empty-state">
              <h3>Aucun flux RSS ajouté</h3>
              <p>Commencez par ajouter votre premier flux RSS pour voir les articles.</p>
            </div>
          ) : (
            feeds.map((feed) => {
              const feedItemsForFeed = feedItems[feed.id] || [];
              const paginationForFeed = pagination[feed.id] || {};
              return (
                <FeedColumn
                  key={feed.id}
                  feed={feed}
                  feedItems={feedItemsForFeed}
                  pagination={paginationForFeed}
                  onToggleRead={handleToggleRead}
                  onDeleteFeed={handleDeleteFeed}
                  onPageChange={(page) => handlePageChange(feed.id, page)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 
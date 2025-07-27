import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedsAPI } from '../services/api';

const AddFeed = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await feedsAPI.create(formData);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError('Erreur lors de l\'ajout du flux');
      }
      console.error('Error creating feed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">➕ Ajouter un flux RSS</h2>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Titre du flux
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Le Monde - Actualités"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="url" className="form-label">
                  URL du flux RSS
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://www.lemonde.fr/rss/une.xml"
                  required
                />
                <div className="form-text">
                  Entrez l'URL complète du flux RSS (format XML)
                </div>
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Ajout en cours...
                    </>
                  ) : (
                    'Ajouter le flux'
                  )}
                </button>
                
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Annuler
                </button>
              </div>
            </form>

            <div className="mt-4">
              <h6>Exemples de flux RSS :</h6>
              <ul className="list-unstyled">
                <li>• Le Monde : https://www.lemonde.fr/rss/une.xml</li>
                <li>• 20 Minutes : https://www.20minutes.fr/rss/une.xml</li>
                <li>• TechCrunch : https://techcrunch.com/feed/</li>
                <li>• Le Figaro : https://www.lefigaro.fr/rss/figaro_actualites.xml</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFeed; 
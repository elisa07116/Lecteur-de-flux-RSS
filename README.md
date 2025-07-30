# Lecteur de Flux RSS

Un lecteur de flux RSS moderne et intuitif développé avec React.js pour le frontend et Ruby on Rails pour le backend.

## Fonctionnalités

### Fonctionnalités de Base
- **Ajout de flux RSS** : Ajoutez facilement de nouveaux flux en spécifiant l'URL et le titre
- **Lecture des flux** : Récupération automatique et stockage en base de données
- **Affichage des articles** : Interface en deux colonnes pour une lecture optimale
- **Gestion du statut de lecture** : Marquez les articles comme lus/non lus
- **Suppression de flux** : Supprimez les flux RSS que vous ne souhaitez plus suivre

### Fonctionnalités Avancées
- **Pagination** : 5 articles par page avec navigation
- **Récupération automatique** : Bouton pour synchroniser tous les flux
- **Interface responsive** : Design adaptatif pour tous les écrans
- **Design moderne** : Interface épurée avec effets de survol

## Architecture

### Frontend (React.js)
```
frontend/
├── src/
│   ├── components/           # Composants React modulaires
│   │   ├── AddFeedForm.js    # Formulaire d'ajout de flux
│   │   ├── ActionButtons.js  # Boutons d'action principaux
│   │   ├── FeedColumn.js     # Colonne de flux avec articles
│   │   └── FeedItem.js       # Article individuel
│   ├── services/
│   │   └── api.js           # Services API pour communiquer avec le backend
│   ├── App.js               # Composant principal
│   ├── App.css              # Styles principaux
│   └── index.js             # Point d'entrée React
└── package.json
```

### Backend (Ruby on Rails)
```
backend/
├── app/
│   ├── controllers/
│   │   └── api/v1/          # Contrôleurs API RESTful
│   │       ├── feeds_controller.rb
│   │       └── feed_items_controller.rb
│   ├── models/
│   │   ├── feed.rb          # Modèle Flux RSS
│   │   └── feed_item.rb     # Modèle Article
│   ├── services/
│   │   └── rss_fetcher_service.rb  # Service de récupération RSS
│   └── serializers/         # Sérialiseurs JSON
├── config/
│   └── routes.rb            # Configuration des routes API
└── db/
    └── schema.rb            # Schéma de base de données
```

## Base de Données

### Tables
- **feeds** : Stockage des flux RSS (titre, URL, date de création)
- **feed_items** : Stockage des articles (titre, résumé, URL, statut de lecture, date de publication)

## Installation et Lancement

### Prérequis
- **Node.js** (version 14 ou supérieure)
- **Ruby** (version 2.7 ou supérieure)
- **Rails** (version 6 ou supérieure)
- **MySQL** (serveur de base de données)


### 1. Configuration du Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances Ruby
bundle install

# Configurer la base de données
cp config/database.yml.example config/database.yml
# Éditer config/database.yml avec vos paramètres MySQL

# Créer et migrer la base de données
rails db:create
rails db:migrate

# Ajouter des données de test (optionnel)
rails db:seed

# Lancer le serveur Rails
rails server
```

Le backend sera accessible sur `http://localhost:3000`

### 2. Configuration du Frontend

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances Node.js
npm install

# Lancer le serveur de développement
npm start
```

Le frontend sera accessible sur `http://localhost:3001`


## API Endpoints

### Flux RSS
- `GET /api/v1/feeds` - Liste tous les flux
- `POST /api/v1/feeds` - Crée un nouveau flux
- `DELETE /api/v1/feeds/:id` - Supprime un flux
- `POST /api/v1/feeds/:id/fetch_all` - Récupère tous les flux

### Articles
- `GET /api/v1/feeds/:feed_id/feed_items` - Liste les articles d'un flux
- `PATCH /api/v1/feed_items/:id/toggle_read` - Bascule le statut de lecture


## Utilisation

### Ajouter un Flux RSS
1. Cliquez sur "Ajouter un flux"
2. Remplissez le titre et l'URL du flux RSS
3. Cliquez sur "Ok"

### Gérer les Articles
- **Marquer comme lu** : Cliquez sur le bouton en bas à droite de l'article
- **Navigation** : Utilisez les boutons de pagination en bas de chaque colonne
- **Supprimer un flux** : Cliquez sur l'icône poubelle à côté du titre du flux

### Synchroniser les Flux
- Cliquez sur "Récupérer les flux" pour mettre à jour tous les flux RSS

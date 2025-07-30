# Choix Techniques et Difficultés Rencontrées

## Choix Techniques

### Architecture Frontend/Backend

**Choix : React.js + Ruby on Rails API**

**Justification :**
- **React.js** : Framework moderne avec une grande communauté, composants réutilisables et gestion d'état efficace
- **Ruby on Rails** : Framework robuste pour les APIs, convention over configuration, excellente intégration avec les bases de données
- **Séparation des responsabilités** : Frontend pour l'interface utilisateur, Backend pour la logique métier et la gestion des données

### Base de Données

**Choix : MySQL**

**Justification :**
- Base de données relationnelle éprouvée et stable
- Excellente intégration avec Rails via Active Record
- Performance optimale pour les applications web
- Large communauté et documentation abondante

## Difficultés Rencontrées

### Apprentissage de Ruby on Rails

**Difficulté majeure :** Je n'avais jamais pratiqué Ruby auparavant et j'ai dû l'apprendre en faisant ce projet.

**Impact :**
- **Conventions** : Comprendre les conventions Rails (naming, structure des dossiers, etc.)

**Solutions adoptées :**
- Utilisation de tutoriels et guides en ligne
- Tests et expérimentations pour comprendre les concepts

### Configuration et Installation

**Difficulté :** Les installations ont pris plus de temps que prévu.

**Problèmes rencontrés :**
- **Configuration MySQL** : Paramétrage de la base de données et gestion des permissions
- **Gestion des dépendances** : Installation et configuration des gems Ruby
- **Configuration CORS** : Mise en place de la communication entre frontend et backend
- **Variables d'environnement** : Configuration des différents environnements

**Solutions :**
- Tests itératifs pour valider chaque étape

### Parsing RSS

**Difficulté :** Gestion robuste des différents formats RSS.

**Problèmes :**
- **Formats variés** : Différents standards RSS et Atom
- **Gestion d'erreurs** : Flux RSS malformés ou inaccessibles
- **Performance** : Parsing de gros volumes de données

**Solutions :**
- Utilisation de la gem Feedjira pour un parsing robuste
- Implémentation de gestion d'erreurs complète
- Logs détaillés pour le debugging

#!/bin/bash

echo "⚛️  Installation du frontend React"
echo "=================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 14+"
    exit 1
fi

echo "✅ Node.js $(node --version) détecté"

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ npm $(npm --version) détecté"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées"

echo ""
echo "🎉 Frontend React installé avec succès !"
echo ""
echo "Pour démarrer le frontend :"
echo "  npm start"
echo ""
echo "Pour démarrer l'architecture complète :"
echo "  cd .. && ./start.sh" 
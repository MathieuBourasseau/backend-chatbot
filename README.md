# 🤖 Mistral AI Chat - Backend API

Ceci est l'API backend de l'application **Mistral Chat**, conçue pour offrir une interface de conversation intelligente et fluide. Le serveur agit comme une passerelle sécurisée entre le frontend React et les modèles de langage de Mistral AI.

## 🚀 Fonctionnalités

* **Intégration Mistral AI** : Exploitation du modèle `mistral-small-latest` pour des réponses rapides et pertinentes.
* **Gestion d'Historique** : Sauvegarde persistante des échanges pour permettre une continuité conversationnelle.
* **Synthèse de Titre** : Génération automatique d'un titre court pour chaque discussion dès le premier message.
* **Formatage UI-Ready** : Système de `SYSTEM_PROMPT` optimisé pour le rendu Markdown côté client.
* **Architecture MVC** : Organisation propre du code pour une maintenance et une évolutivité facilitées.

## 🛠️ Stack Technique

* **Runtime** : [Node.js](https://nodejs.org/)
* **Framework** : [Express.js](https://expressjs.com/)
* **ORM** : [Sequelize](https://sequelize.org/) (PostgreSQL)
* **IA** : [Mistral AI API](https://mistral.ai/)
* **Validation** : Joi (Schemas de validation de données)
* **Sécurité** : JWT & Dotenv

## 📂 Architecture du Projet

Le projet suit une structure **MVC** (Modèle-Vue-Contrôleur) organisée comme suit :

```text
app/
 ├── controllers/    # Logique métier et interaction avec l'IA
 ├── data/           # Scripts de création et de seeding de la base de données
 ├── middlewares/    # Vérifications de sécurité et configuration Multer
 ├── models/         # Définition des schémas de données (Sequelize)
 ├── routes/         # Points d'entrée de l'API (index, chat, user)
 ├── schemas/        # Schémas de validation (Joi)
 ├── uploads/        # Stockage des fichiers locaux
 ├── .env.example    # Modèle des variables d'environnement
 ├── .gitignore      # Fichiers exclus du versioning (ex: .env)
 └── index.js        # Point d'entrée principal de l'application
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
```

## 🔐 Authentification & Sécurité

Le backend intègre un système d'authentification robuste pour garantir la confidentialité des données :

* **JSON Web Token (JWT)** : Utilisé pour sécuriser les échanges entre le client et le serveur.
* **Middleware d'Authentification** : Un garde-barrière (`authenticateToken`) vérifie la validité du token pour chaque requête vers les ressources privées.
* **Isolation des Données** : Chaque utilisateur ne peut accéder qu'à ses propres conversations. Les requêtes SQL sont filtrées par l'ID utilisateur extrait du token sécurisé.

## ⚙️ Installation et Configuration

1. **Cloner le dépôt**

   ```bash
   git clone <votre-url-repo-back>
   cd <nom-du-dossier>
   ```

2. **Installer les dépendances**
    ```bash
   npm install
   ```


3. **Configurer les variables d'environnement Copiez le fichier .env.example en .env et remplissez vos informations :**

    ```bash
   cp .env.example .env
   ```

   Variables nécessaires :

    - PORT : Port du serveur (ex: 3000)

    - MISTRAL_API_KEY : Votre clé API Mistral

    - JWT_SECRET : Une chaîne aléatoire pour signer vos tokens

    - DATABASE_URL : URL de connexion à votre base PostgreSQL


4. **Initialiser la base de données**
   Exécutez les scripts de création des tables et de peuplement (seeding) :
   ```bash
   # Création des tables (PostgreSQL)
   node app/data/01-create-tables.js
   
   # (Optionnel) Ajout de données de test
   node app/data/02-seed-tables.js


5. **Lancer le serveur**
   ```bash
   # Mode développement (rechargement automatique)
   npm run dev

   # Mode production
   npm start

## 🔌 API Endpoints

### Authentification (Public)
| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/signup` | Inscription d'un nouvel utilisateur (avec upload photo) |
| `POST` | `/login` | Authentification et génération du token JWT |
| `GET` | `/me` | Vérification de la validité du token actuel |

### Conversations (Privé - JWT requis)
| Méthode | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/chats` | Récupère la liste des conversations de l'utilisateur connecté |
| `POST` | `/chats` | Crée une conversation (génère un titre via l'IA) |
| `GET` | `/chats/:id/messages` | Récupère l'historique complet d'un chat (vérification de propriété) |
| `POST` | `/chats/:id/messages` | Ajoute un message utilisateur et génère la réponse IA |

## 🧠 Intelligence Artificielle & Prompting

L'application utilise une ingénierie de prompt spécifique pour garantir une expérience fluide :
- **Synthèse de titre** : Un prompt système dédié analyse le premier message pour nommer automatiquement la conversation.
- **Optimisation Markdown** : Le `SYSTEM_PROMPT` force l'IA à répondre avec une structure aérée (doubles sauts de ligne), garantissant un rendu lisible via `react-markdown` sur mobile.

---
**Développé avec passion par moi-même**
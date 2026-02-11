# BilletLove

Extension navigateur pour aider à la gestion des billets sur la plateforme billetweb.fr.

## Vue d'ensemble

BilletLove est une extension navigateur développée pour faciliter la vente et la gestion de billets sur www.billetweb.fr. L'extension vise à améliorer l'expérience utilisateur pour les organisateurs d'événements français.

## Stack technique

- **Framework**: WXT (Web Extension Tools)
- **UI**: React + Mantine
- **Icônes**: @tabler/icons-react
- **Language**: TypeScript
- **Langue de l'interface**: Français

## Stockage

Architecture hybride pour les données:

- **chrome.storage.local**: Configuration utilisateur (tokens API, préférences) - `utils/config-storage.ts`
- **IndexedDB (Dexie)**: Grandes collections (participants, logs API, ...) - `utils/db.ts`
- **Point d'entrée**: `import { storage } from '@/utils/storage'`

## Plateforme cible

- **Site**: www.billetweb.fr
- **Utilisateurs**: Organisateurs d'événements et vendeurs de billets francophones

## Structure du projet

Ce projet utilise le WXT project bootstraper avec l'organisation suivante:

### Répertoires

- **`.output/`**: Tous les artefacts de build
- **`.wxt/`**: Généré par WXT, contient la configuration TypeScript
- **`assets/`**: CSS, images et autres ressources traitées par WXT
- **`components/`**: Composants UI React (auto-importés)
- **`entrypoints/`**: Points d'entrée de l'extension (popup, content scripts, background, etc.)
- **`hooks/`**: Hooks React personnalisés (auto-importés)
- **`modules/`**: Modules WXT locaux pour le projet
- **`public/`**: Fichiers copiés tels quels dans le build (icônes, manifeste, etc.)
- **`utils/`**: Utilitaires génériques (auto-importés)

### Fichiers de configuration

- **`wxt.config.ts`**: Configuration principale de WXT
- **`tsconfig.json`**: Configuration TypeScript
- **`web-ext.config.ts`**: Configuration du démarrage du navigateur
- **`app.config.ts`**: Configuration runtime
- **`postcss.config.cjs`**: Configuration PostCSS pour Mantine
- **`theme.ts`**: Configuration du thème Mantine
- **`.env`**: Variables d'environnement
- **`.env.publish`**: Variables d'environnement pour la publication
- **`package.json`**: Dépendances et scripts npm

## Développement

```bash
# Installation des dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build
```

## Notes

- Extension destinée au marché français
- Interface entièrement en français
- Focus sur l'amélioration de l'expérience utilisateur billetweb.fr

# Plan d'intégration Backend Login au Frontend

## Informations Collectées

### Backend (Spring Boot)
- **URL**: `http://localhost:8080/api`
- **Endpoint Login**: `POST /v- **Login1/auth/login`
Request**: `{ username: string, password: string }`
- **AuthResponse**: `{ userId, username, email, fullName, permissions, accessToken, refreshToken, accessTokenExpiresIn }`
- **CORS**: Autorise `http://localhost:3000`

### Frontend (React + Vite)
- **Stack**: React, TypeScript, Zustand, Vite
- **Store**: `src/store/appStore.ts` - contient la fonction `login` avec données mockées
- **Login**: `src/features/auth/Login.tsx` - composant de login

## Plan d'Implémentation

### Étape 1: Créer le service API d'authentification
- Créer `src/services/api.ts` - configuration axios avec interceptors
- Créer `src/services/authService.ts` - fonctions pour login, logout, refresh token

### Étape 2: Modifier le Store Zustand
- Mettre à jour `src/store/appStore.ts`
- Remplacer les mock users par un appel au backend
- Ajouter la gestion des tokens JWT

### Étape 3: Mettre à jour le composant Login
- Ajouter gestion des erreurs plus détaillée
- Supprimer les boutons "Accès rapide (Demo)" ou les adapter

### Étape 4: Créer les types TypeScript
- Créer `src/types/auth.ts` pour les types d'authentification

## Fichiers à Modifier
- `frontend/src/store/appStore.ts`
- `frontend/src/features/auth/Login.tsx`

## Nouveaux Fichiers à Créer
- `frontend/src/services/api.ts`
- `frontend/src/services/authService.ts`
- `frontend/src/types/auth.ts`


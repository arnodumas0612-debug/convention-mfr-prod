# Guide de déploiement Netlify

## Prérequis
- Compte Netlify gratuit
- Compte GitHub
- Projet Supabase cmquwxoziwaxzgugfjof

## Étapes

### 1. Créer le repository GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/convention-mfr.git
git push -u origin main
```

### 2. Déployer sur Netlify
1. Allez sur https://app.netlify.com/
2. Add new site → Import project
3. Sélectionnez GitHub
4. Choisissez votre repository

### 3. Configuration
Build command: npm run build
Publish directory: dist

### 4. Variables environnement
Dans Netlify Dashboard → Site settings → Environment variables :

```
VITE_SUPABASE_URL = https://cmquwxoziwaxzgugfjof.supabase.co
VITE_SUPABASE_ANON_KEY = votre_cle_depuis_supabase
VITE_APP_URL = https://votre-site.netlify.app
VITE_ENV = production
```

### 5. Déployer
Cliquez Deploy site

## Mises à jour
```bash
git add .
git commit -m "Description"
git push
```

Netlify redéploie automatiquement.

## Checklist tests
- Navigation toutes routes
- Création convention
- Workflow signatures
- Téléchargement
- Test mobile

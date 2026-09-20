# Batimedaf — site vitrine

Site des résidences Batimedaf (Le Bosquet, Les Ateliers). Vite + React, en
français et en anglais, avec un espace d'administration (`/admin`) pour
modifier les textes et les photos sans toucher au code.

## Lancer le site en local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # génère le dossier dist/
```

Il faut Node 20.19 ou plus récent (22 recommandé).

## Modifier le contenu : l'espace admin

Adresse : `/admin` (par exemple `https://votre-site.netlify.app/admin`).

- **Sans Supabase** (état par défaut) : mot de passe local `1234`. Les
  modifications restent **dans le navigateur de la personne qui les fait** :
  personne d'autre ne les voit. Utile seulement pour essayer.
- **Avec Supabase** (à configurer une fois, voir plus bas) : chaque
  administrateur se connecte avec son e-mail et son mot de passe, et les
  modifications sont enregistrées en ligne : tout le monde les voit sur le site
  quelques instants après.

Les textes et photos modifiés depuis l'admin sont stockés dans Supabase, pas
dans ce dépôt GitHub. Le dépôt ne sert qu'aux modifications de code.

> Une section enregistrée depuis l'admin prend le dessus sur le texte écrit
> dans le code (`src/content/defaults.js`, `src/data/residences.js`…). Si on
> change un texte dans le code après coup, il n'apparaîtra pas sur le site
> tant que la section a déjà été enregistrée depuis l'admin.

## Mise en ligne sur Netlify

1. Sur <https://app.netlify.com> : **Add new site → Import an existing
   project → GitHub**, puis choisir ce dépôt. Les réglages de build viennent
   du fichier `netlify.toml` : rien à saisir.
2. Le site est publié. Chaque `git push` sur la branche `main` le met à jour
   automatiquement.
3. L'admin partagée est déjà branchée : l'adresse du projet Supabase et sa
   clé publique sont dans le fichier `.env.production`, que Netlify lit au
   moment du build. Rien à saisir dans Netlify. Pour utiliser un autre projet
   Supabase, changer ces deux valeurs dans ce fichier (ou définir les mêmes
   variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans **Site
   configuration → Environment variables**, qui ont priorité) puis pousser ou
   relancer un déploiement.

## Configurer Supabase

Déjà fait pour le projet `batimedaf` (table du contenu, dossier `media`, règles
de sécurité, inscriptions publiques désactivées). Les étapes ci-dessous servent
pour un nouveau projet :

1. Créer un projet gratuit sur <https://supabase.com>.
2. **SQL Editor** → coller le contenu de `supabase/schema.sql` → *Run*. Cela
   crée la table du contenu et le dossier `media` pour les photos, avec les
   bonnes règles (lecture publique, écriture réservée aux administrateurs).
3. **Authentication → Users → Add user** : créer un compte (e-mail + mot de
   passe, cocher *Auto Confirm User*) pour chaque personne qui doit modifier le
   site.
4. **Authentication → Sign In / Providers** : désactiver les inscriptions
   publiques (*Allow new users to sign up*), pour que seuls les comptes créés à
   l'étape 3 puissent se connecter.
5. **Project Settings → API Keys** : copier l'URL du projet et la clé
   *publishable* (ou `anon public`) dans `.env.production`. Pour tester en
   local, les mettre dans un fichier `.env.local` (voir `.env.example`).

Ne jamais publier la clé *secret* / `service_role` : seule la clé publique va
dans le site.

## Ajouter un administrateur

Dans Supabase : **Authentication → Users → Add user → Create new user**, avec
son e-mail et un mot de passe, en cochant *Auto Confirm User*. Il se connecte
ensuite sur `/admin` avec ces identifiants.

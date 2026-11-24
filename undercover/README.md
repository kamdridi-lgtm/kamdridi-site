# UNDERCOVER — espace de travail (prévisualisation)

Ce dossier est réservé au site interactif **KAM DRIDI — UNDERCOVER**. Il n'est **pas** destiné à remplacer le site public ni la page **IN | SENISTRE**.

## Source et statut

- Branche dédiée : `work/undercover-private-preview` (pas `main`).
- Source de référence actuelle : **UNDERCOVER V12 mobile corrigée**, pas une nouvelle V13.
- Les versions téléchargées ont été provisoires. Toute modification future doit désormais être suivie ici.
- **Attention :** les fichiers complets (HTML avec images/vidéo intégrées et les masters WAV) ne sont **pas encore déposés sur cette branche**. Ne pas déclarer cette branche fonctionnelle tant que le site n'y est pas réellement monté et testé.
- L'ordinateur connecté par Desktop Commander (`mimishouse`) est actuellement **hors ligne**; vérifier à nouveau son état lors de la reprise.
- La connexion Vercel actuelle ne donne accès à aucun projet, même dans l'équipe `kam-dridis-projects`. Configurer un projet preview relié à cette branche si disponible.

## Assets et chapitres

1. Europe — Never Gonna Say Goodbye (WAV 24 bits / 48 kHz, pochette installée).
2. Bon Jovi — Deep Cuts the Night (WAV, pochette installée).
3. Def Leppard — Heat Street (WAV, pochette installée).
4. Warrant — Only a Man (−2) (WAV, **pochette choisie montrant cinq musiciens**). Sa vérification mobile est **bloquante**: une ancienne page affichait l'image manquante.
5. Glenn Medeiros — High Wire (pochette fournie: visuel *The Karate Kid Part III*, **audio en attente**).
6. Iron Maiden — Remember Tomorrow (en attente).
7. Noam Kaniel — Goldorak (en attente).

### Correction prioritaire

- Warrant: afficher la **pochette exacte** fournie par l'utilisateur dans la carte ET le dossier, même sur Android. Vérifier les chemins d'images et les médias avec un serveur HTTP, pas simplement `file://`.
- High Wire: placer la pochette fournie dans la carte 05 et le chapitre; ne pas générer une autre image.
- Garder le fond animé V6 (violet/ambre), les autres visuels et textes approuvés.
- Le suivi privé doit compter une écoute qualifiée par chanson après 30 secondes réelles et suivre séparément les clics vers les originaux. Le serveur V12 existant est à auditer (références anciennes à V10, suivi partiel).
- **Ne pas publier les WAV sur un dépôt public ni dans un déploiement non protégé**, et ne pas diffuser publiquement les reprises tant que les autorisations ne sont pas clarifiées.
- Ne pas écrire ni modifier la page d'accueil IN | SENISTRE, son bouton ou les pages de production existantes.

## Façon de travailler

Un **seul projet**, une **branche stable**, un **lien preview** (idéalement protégé), aucun ZIP envoyé à répétition. Publier un correctif seulement après tests sur ordinateur et sur Android. Ce README documente le transfert, **pas encore le déploiement**.

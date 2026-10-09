# KAM DRIDI — ECHOES UN LIVE IN BRASIL

Page web statique responsive, prête à déployer sur Vercel, Netlify ou n’importe quel hébergement statique.

## Ouvrir localement

Double-cliquer sur `index.html` fonctionne pour la mise en page. Pour une meilleure compatibilité audio :

```bash
python -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Déploiement Vercel

1. Créer un nouveau projet.
2. Importer ce dossier.
3. Framework Preset : `Other`.
4. Build command : laisser vide.
5. Output directory : `.`

## À connecter avant publication

- Remplacer l’action du formulaire e-mail par Mailchimp, Brevo, ConvertKit ou Supabase.
- Remplacer les extraits audio par les liens définitifs ou les lecteurs Spotify/Apple Music.
- Ajouter les liens officiels des réseaux sociaux dans le footer.
- Vérifier le texte final du setlist et les durées restantes avant la sortie.

## Correspondance des fichiers audio corrigée

- `Too Fast Too Young` utilise la source `222 (Unplugged Arena Version).mp3`.
- `For Some Dialog…` utilise la source `Into the News (Live Lounge Club Mix).mp3`.
- La version bonus de `For Some Dialog…` utilise `Into the News (Unplugged Acoustic Session).mp3`.


## Étape 10 — mobile + boutique

- Boutons de commande reliés à la boutique officielle : https://kamdridi.com/store
- Images d’édition et visuel audio servis en WebP pour accélérer le mobile.
- Cibles tactiles, header, hero, lecteur audio, mosaïque photo et ancres corrigés pour petits écrans.
- Langue sélectionnée mémorisée sur l’appareil.
- Test statique des références locales et de la syntaxe JavaScript inclus lors de la génération.

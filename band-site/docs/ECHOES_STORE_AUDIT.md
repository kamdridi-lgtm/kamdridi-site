# Audit d'Intégration Boutique - ECHOES UN LIVE IN BRASIL

**Date :** 2026-07-17

## 1. Éditions ECHOES Identifiées (depuis index.html)

| Édition ECHOES | Image | Prix visible | Produit boutique existant | URL actuelle | URL directe recommandée | Action nécessaire |
|---|---|---:|---|---|---|---|
| **Edição Deluxe** (Box deluxe + vinil) | `assets/images/edition-deluxe.webp` | À CONFIRMER | Aucun | `https://kamdridi.com/store` | `/store/echoes-brasil-deluxe` | Créer produit |
| **Livreto** (Livreto de colecionador) | `assets/images/edition-livret.webp` | À CONFIRMER | Aucun | `https://kamdridi.com/store` | `/store/echoes-brasil-livreto` | Créer produit |
| **Edição Expandida** (Versão padrão + bônus) | `assets/images/edition-expanded.webp` | À CONFIRMER | Aucun | `https://kamdridi.com/store` | `/store/echoes-brasil-expanded` | Créer produit |

## 2. Structure de Produits Recommandée

### `echoes-brasil-deluxe`
- **Nom public :** Echoes Un Live in Brasil - Deluxe Box Set
- **Slug :** echoes-brasil-deluxe
- **Image officielle :** `assets/images/edition-deluxe.webp`
- **Description :** Apresentação de coleção com estojo premium, disco preto e cartão da edição.
- **Informations nécessaires :** Prix, identifiant Stripe (Price ID) si facturation stricte, statut de stock.
- **Route recommandée :** `/store/echoes-brasil-deluxe`

### `echoes-brasil-livreto`
- **Nom public :** Echoes Un Live in Brasil - Collector Booklet
- **Slug :** echoes-brasil-livreto
- **Image officielle :** `assets/images/edition-livret.webp`
- **Description :** Páginas internas com imagens ao vivo, créditos e o universo visual da Edição Expandida.
- **Informations nécessaires :** Prix, identifiant Stripe, statut de stock.
- **Route recommandée :** `/store/echoes-brasil-livreto`

### `echoes-brasil-expanded`
- **Nom public :** Echoes Un Live in Brasil - Expanded Edition
- **Slug :** echoes-brasil-expanded
- **Image officielle :** `assets/images/edition-expanded.webp`
- **Description :** Apresentação refinada do álbum com visual principal, faixas bônus incluídas e pedido direto.
- **Informations nécessaires :** Prix, identifiant Stripe, statut de stock.
- **Route recommandée :** `/store/echoes-brasil-expanded`

## 3. Produits Existants de la Boutique (data/store.ts & checkout/route.ts)
Aucun produit "Echoes Un Live in Brasil" n'existe actuellement. Seuls les produits "Echoes Unearthed" (Tees) et "Salieri's Hands" sont présents. 

La variable d'environnement utilisée pour activer la boutique est `STRIPE_SECRET_KEY`. Le checkout (dans `api/checkout/route.ts`) gère les articles dynamiquement via un dictionnaire `salieriCheckoutCatalog` ou en utilisant les prix injectés par le front-end. 

## 4. Audit des Boutons de la Page ECHOES

- **Hero / Navigation :**
  - "Ouvir as sessões" -> `href="#ouvir"` (bouton navigation, OK)
  - "Ver as fotos" -> `href="#galeria"` (bouton navigation, OK)
  - "Acompanhar o projeto" -> `href="#contato"` (bouton navigation, OK)
- **Store / Achat :**
  - "Encomendar" (Deluxe) -> `href="https://kamdridi.com/store"` (bouton store, redirige vers la boutique générale, à mettre à jour plus tard)
  - "Encomendar" (Livreto) -> `href="https://kamdridi.com/store"` (bouton store)
  - "Encomendar" (Expandida) -> `href="https://kamdridi.com/store"` (bouton store)
- **Lightbox / Images :**
  - "Ver" (x3) -> boutons d'édition (déclenchent la lightbox, OK)
- **Audio :**
  - Contrôles de piste (Play, Prev, Next, Playlist) -> boutons audio (appels JS, OK)

Aucun lien mort (`#` vide) ou url inexistante détecté dans la navigation principale.

## 5. Problèmes Détectés dans la Boutique Actuelle
- **Aucun lien direct :** Les boutons "Encomendar" renvoient vers la page d'accueil de la boutique (`/store`), où les produits ECHOES UN LIVE IN BRASIL sont totalement absents. L'utilisateur arrive dans une impasse.
- **Produits manquants :** L'API de checkout et le catalogue (`store.data.ts`/`store.ts`) ignorent totalement les trois nouvelles éditions.

*(Aucun produit, prix ou secret Stripe n'a été modifié lors de cet audit).*

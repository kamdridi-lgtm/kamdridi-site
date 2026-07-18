# Données Manquantes : Produits ECHOES UN LIVE IN BRASIL

Les trois éditions d'ECHOES UN LIVE IN BRASIL sont préparées dans le code (`band-site/data/echoes-brasil-products.ts`) mais sont gardées inactives et cachées via un drapeau de développement local.

Voici le récapitulatif des données nécessaires pour finaliser les fiches et autoriser la vente.

| Produit | Prix requis | Devise | Stock ou précommande | Livret indépendant ? | Contenu à confirmer | Stripe Price ID |
|---|---|---|---|---|---|---|
| **Expanded Edition** (`echoes-brasil-expanded`) | **Confirmé pour le brouillon (69.00)** | **CAD** | **Prévente** | N/A | À CONFIRMER | Toujours à confirmer |
| **Collector Booklet** (`echoes-brasil-livreto`) | **Confirmé pour le brouillon (39.00)** | **CAD** | **Prévente** | À CONFIRMER | À CONFIRMER | Toujours à confirmer |
| **Deluxe Box + Vinyl** (`echoes-brasil-deluxe`) | **Confirmé pour le brouillon (229.00)** | **CAD** | **Prévente** | N/A | À CONFIRMER | Toujours à confirmer |

*Coût de production :* Toujours à confirmer.
*Date d'expédition :* Toujours à confirmer.


*Note de conflit :* Le livret est présenté comme une édition à part, mais pourrait être inclus ou dépendre d'autres bundles. Il est actuellement conservé séparé. Il faudra confirmer s'il s'agit bien d'un produit achetable séparément.

## Procédure d'Activation

Une fois les données fournies par la gestion, suivre cette procédure exacte pour activer les produits en production :

1. Confirmer le prix
2. Confirmer la devise
3. Confirmer le stock ou la précommande
4. Créer le produit sur le tableau de bord Stripe
5. Ajouter le Stripe Price ID dans la configuration si une validation stricte est activée, ou s'assurer que le prix correspond à Stripe
6. Activer le produit dans `band-site/data/echoes-brasil-products.ts` (`active: true`, `visible: true`, remplissage des prix et statuts d'inventaire)
7. Rendre visible dans le catalogue (retirer la protection de la variable d'environnement ou ajouter le produit à `data/store.ts` pour qu'il s'affiche dans la grille de `/store`)
8. Connecter les boutons "Encomendar" de la page de présentation ECHOES vers les URLs `/store/echoes-brasil-*` exactes
9. Tester une commande de bout en bout sur l'environnement de démo (Checkout désactivé) ou avec des clés de test Stripe
10. Déployer sur Vercel (`main`)

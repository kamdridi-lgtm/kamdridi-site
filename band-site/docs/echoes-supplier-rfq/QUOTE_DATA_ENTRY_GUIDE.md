# QUOTE DATA ENTRY GUIDE

**STATUS: DRAFT — NOT SENT**

Ce guide explique comment transférer un devis reçu (quotation) dans notre planificateur de marge interne (`/store/echoes-brasil-planning`).

## Règles générales de saisie
1. **Conversion en cents :** Tous les montants doivent être saisis en cents. Par exemple, un coût de `25,50 $` devient `2550`.
2. **Devise :** Assurez-vous que la devise du devis correspond bien à CAD (Canadian Dollars). Si le devis est en USD, convertissez-le manuellement avec un taux de change conservateur avant la saisie, ou demandez un devis en CAD.
3. **Taxes :** Les taxes récupérables ne doivent **pas** être mélangées arbitrairement aux coûts de fabrication. Ne saisissez que le coût net.
4. **Valeurs inconnues (`null`) :** Si un montant est inconnu, laissez le champ vide (qui équivaut à `null` dans le système).
5. **Vrai zéro (`0`) :** Le chiffre `0` est utilisé **uniquement** lorsqu'un coût ne s'applique réellement pas et a été confirmé (ex: pas de frais d'assemblage).

## Correspondance des champs du planificateur

Lorsque vous lisez le devis du fournisseur, reportez les coûts dans les champs appropriés :

- **Pressage et fabrication :** `manufacturingCostCents`
- **Impression supplémentaire (pochettes, inserts, livrets) :** `printingCostCents`
- **Emballage individuel (shrink-wrap, boîtes individuelles) :** `packagingCostCents`
- **Transport fournisseur vers Montréal :** `inboundFreightCents`
- **Assemblage (insertion des livrets, cartes) :** `assemblyCostCents`
- **Contribution éventuelle aux frais de livraison client (si applicable) :** `shippingSubsidyCents`
- **Autres coûts variables non classifiés :** `otherVariableCostCents`
- **Artwork / Design (frais uniques) :** `oneTimeArtworkCostCents`
- **Préparation (setup, mastering, stampers, plaques) :** `oneTimeSetupCostCents`
- **Prototype (test pressings, épreuves couleurs physiques) :** `oneTimePrototypeCostCents`
- **Quantité planifiée pour le tirage :** `plannedQuantity`

Une fois tous les champs remplis pour une quantité spécifique, le planificateur calculera automatiquement la viabilité financière de cette configuration.

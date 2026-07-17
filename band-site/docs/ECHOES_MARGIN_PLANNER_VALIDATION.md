# ECHOES UN LIVE IN BRASIL — Margin Planner Validation rules

## Distinction entre null et 0
Pour garantir l'intégrité financière, une distinction stricte est faite entre `null` et `0` :
- `null` (ou champ vide) signifie **INCONNU**. Le calcul est alors bloqué et affiché comme **CALCULATION INCOMPLETE**.
- `0` signifie **COÛT VÉRIFIÉ À ZÉRO** (ex: un coût qui ne s'applique pas). Le calcul peut alors s'effectuer normalement.

## Champs obligatoires
Tous les champs suivants doivent être explicitement fournis (soit un nombre, soit 0) pour que le calculateur fonctionne :
- `manufacturingCostCents`
- `printingCostCents`
- `packagingCostCents`
- `inboundFreightCents`
- `assemblyCostCents`
- `paymentFeePercent`
- `paymentFeeFixedCents`
- `shippingSubsidyCents`
- `returnsReservePercent`
- `marketingCostPerUnitCents`
- `otherVariableCostCents`
- `oneTimeArtworkCostCents`
- `oneTimeSetupCostCents`
- `oneTimePrototypeCostCents`
- `plannedQuantity`

## Règles de validation
- **Coûts (cents)** : doivent être des entiers positifs ou égaux à 0.
- **Pourcentages** : doivent être compris entre 0 et 100 inclus.
- **Quantité planifiée** : doit être un entier strictement supérieur à 0.
- Les nombres négatifs, décimaux (pour les cents/quantités), `NaN` ou `Infinity` sont rejetés en tant que `INVALID VALUES`.

## Arrondis monétaires
Tous les résultats monétaires exprimés en cents sont arrondis à l'entier le plus proche avec `Math.round`. 
Cela concerne : `paymentFee`, `returnsReserve`, `variableCost`, `profitPerUnit`, `fixedCosts`, `totalProfit`.
Le seuil de rentabilité (`breakEvenUnits`) utilise `Math.ceil`.

## Comportement de marge négative
Si le `profitPerUnit` est inférieur ou égal à 0 :
- L'interface affiche **NEGATIVE UNIT ECONOMICS** en rouge.
- La marge est calculée mais affichée en rouge.
- Le seuil de rentabilité (`Break-Even Units`) affiche **NOT REACHABLE**.

## Comportement du seuil de rentabilité
- Si le bénéfice unitaire est positif : calcul normal `Math.ceil(fixedCosts / profitPerUnit)`.
- Si les coûts fixes sont à 0 et le bénéfice unitaire est positif : `0`.
- Si le bénéfice unitaire est <= 0 : `NOT REACHABLE`.

## Scénarios de test exécutés
- **SCÉNARIO A (Tout vide)** : Affiche "CALCULATION INCOMPLETE" avec les 15 champs manquants.
- **SCÉNARIO B (4 champs seulement)** : Affiche "CALCULATION INCOMPLETE" avec les 11 autres coûts manquants.
- **SCÉNARIO C (Zéros explicites)** : Calcul complet autorisé. Break-even à 0.
- **SCÉNARIO D (Quantité 0)** : Rejette la valeur (Invalid value: Planned quantity must be an integer greater than zero).
- **SCÉNARIO E (Coût négatif)** : Rejette la valeur (Invalid value).
- **SCÉNARIO F (Pourcentage > 100)** : Rejette la valeur (Invalid value).
- **SCÉNARIO G (Bénéfice négatif)** : Affiche "NEGATIVE UNIT ECONOMICS" et "NOT REACHABLE".
- **SCÉNARIO H (Coûts fixes à zéro avec bénéfice positif)** : Break-Even Units : 0.

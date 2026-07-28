# Motion Guidelines

## Règle 01
Tout se matérialise.
Les entrées utilisent `scale(0.97) → scale(1)` + `opacity`.
Jamais de `translateY` pour les apparitions.

## Règle 02
Une seule courbe d'animation.
`cubic-bezier(0.16, 1, 0.3, 1)`

## Règle 03
Trois durées.
- 120ms - micro (hover couleur, focus)
- 220ms - standard (hover carte, transition bouton)
- 320ms - reveal (apparition de section, cascade de cartes)

## Règle 04
Aucune animation n'attire l'attention.
Elle accompagne l'action.

## Règle 05
Chaque mouvement a une raison.
Si un mouvement peut être supprimé sans que l'expérience change, il ne devrait pas exister.

## Transform-origins
- Boutons : `center`
- Cartes : `top left`
- Sections : `center top`
- Images : `center`
- Tags : `center`

## Exceptions
- Le mot dynamique du hero utilise `translateY` (glissement vertical intentionnel).
- Les interactions au survol (hover lift) utilisent `translateY(-2px)` ou `translateY(-6px)`.
- La flèche de scroll utilise `translateY` pour le rebond.

## Accessibilité
- `prefers-reduced-motion: reduce` désactive toutes les animations.
- Le parallax du hero est désactivé sur mobile.
- Les tags techniques sont toujours visibles sur mobile (pas de hover).

## Responsive
- Mobile : animations plus courtes (350ms max), pas de parallax.
- Tablette : grilles en 2 colonnes, espaces réduits.
- Desktop : respiration maximale, toutes les animations actives.

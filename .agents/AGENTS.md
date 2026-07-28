# AGENTS.md — Contrat de développement Eliel Poster

## Philosophie
Le site Eliel Poster est un produit vivant.
Chaque modification doit améliorer le site sans dégrader l'expérience existante.
En cas de doute, privilégier la simplicité.

---

## Règle 1 — Aucune régression
Ne jamais supprimer une fonctionnalité, une page, une animation ou un composant déjà validé sans demande explicite.
Les modifications doivent être additives.

---

## Règle 2 — Les URLs sont stables
Ne jamais renommer :
- pages HTML
- dossiers
- images
- CSS
- JS

sauf demande explicite.
Les liens existants ne doivent jamais être cassés.

---

## Règle 3 — La grammaire du mouvement est unique
Toutes les animations suivent la même règle :
- matérialisation sur place ;
- `scale(0.97)` → `scale(1)` ;
- `opacity`.

Ne jamais utiliser :
- `translateY` (sauf micro-interactions hover / flèche scroll)
- `translateX`
- effets rebond
- rotation
- tilt
- animations spectaculaires

Une nouvelle animation doit respecter cette grammaire.

---

## Règle 4 — Accessibilité
Toujours conserver :
- `prefers-reduced-motion`
- focus clavier
- skip link
- contraste suffisant
- navigation clavier

Aucune nouvelle fonctionnalité ne doit casser ces éléments.

---

## Règle 5 — Performance
Ne jamais sacrifier les performances.
Les animations utilisent uniquement :
- `transform`
- `opacity`

Éviter d'animer :
- `width`
- `height`
- `top`
- `left`
- `margin`

---

## Règle 6 — Le contenu est réel
Ne jamais inventer :
- des clients ;
- des témoignages ;
- des statistiques ;
- des captures ;
- des projets.

Tout doit correspondre à une expérience réelle.

---

## Règle 7 — Le design raconte le travail
Chaque nouvelle section doit répondre à une question simple :
> Est-ce qu'elle aide un visiteur à comprendre comment nous travaillons ?

Si la réponse est non, ne pas l'ajouter.

---

## Règle 8 — Responsive
Chaque modification doit être vérifiée sur :
- mobile
- tablette
- desktop

Le responsive n'est pas une adaptation du desktop.
Chaque format possède sa propre mise en page.

---

## Règle 9 — Une seule identité
Ne jamais ajouter :
- effets "IA"
- blobs
- curseurs personnalisés
- glassmorphism excessif
- particules
- animations tape-à-l'œil

La sobriété fait partie de l'identité d'Eliel Poster.

---

## Règle 10 — Avant chaque livraison
Toujours vérifier :
- tous les liens ;
- toutes les pages ;
- responsive ;
- performances ;
- accessibilité ;
- absence d'erreurs JavaScript ;
- absence de régression visuelle.

---

## Règle 11 — Le contenu avant l'effet
Aucune animation, aucun composant ou effet visuel ne doit compenser un contenu faible.
Si une animation est supprimée, la page doit rester convaincante.

---

## Règle 12 — Les preuves avant les promesses
Lorsqu'une affirmation est faite, elle doit être soutenue par une preuve dès que possible (capture d'écran, étude de cas, schéma, décision expliquée, résultat observé).
Le site doit montrer avant de raconter.

---

## Règle 13 — Une seule voix
Tous les textes doivent donner l'impression d'avoir été écrits par une seule personne.
Éviter les changements de ton entre les pages.
Préférer des phrases simples, naturelles et courtes.

---

## Règle 14 — Une seule source de vérité
Les couleurs, espacements, animations, composants et styles ne doivent jamais être dupliqués.
Toute évolution passe par le Design System.

---

## Règle 15 — Chaque ajout répond à une question
Avant d'ajouter une nouvelle section ou une nouvelle fonctionnalité, répondre à ces trois questions :
1. Quel problème résout-elle ?
2. Comment saura-t-on qu'elle est utile ?
3. Que se passe-t-il si on ne l'ajoute pas ?

Si aucune réponse n'est convaincante, ne pas l'ajouter.

---

## Règle d'or finale
> **Chaque ajout doit rendre le site plus clair, plus utile ou plus crédible. S'il ne remplit aucun de ces trois objectifs, il n'a pas sa place.**

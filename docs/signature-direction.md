# ELIEL POSTER — Faire impression

Refonte du 4 octobre 2026. Une affiche vivante : encre rouge, papier crème, noir d’atelier. Anton pour les grandes compositions typographiques et Outfit pour la lecture. Le symbole historique du studio est conservé.

## Références consultées

- https://filmbot.com/ : hiérarchie typographique directe, alternance entre information et images. Observation du site en ligne et de sa composition mobile.
- https://www.awwwards.com/websites/sites_of_the_day/ : exploration de la sélection actuelle et des catégories portfolio, expérimental, animation et WebGL. Source de repérage, pas modèle à reproduire.
- https://studiodumbar.com/ : les projets constituent l’interface, avec une place dominante donnée au mouvement. Observation du site et de ses liens de projets.
- https://wearecollins.com/ : un propos bref et une identité éditoriale cohérente. Observation de l’ouverture mobile.
- https://www.niccolomiranda.com/ : une matière et une grammaire typographique appliquées à toute l’expérience. Observation du portfolio papier mobile.
- https://activetheory.net/ : référence d’expérience immersive consultée, mais contenu inaccessible au lecteur web sans JavaScript. Pas de conclusion visuelle tirée de cette consultation.

## Décisions

Le hero organise le film dans une découpe arquée au sein de l’affiche. Le film peut être mis en pause et ouvert dans une présentation native avec commandes vidéo. La préférence de mouvement réduit et l’économie de données empêchent sa lecture automatique.

La galerie alterne un portfolio digital, une affiche et un film, sans inventer d’autres réalisations. Chaque projet possède une page dédiée. Le fond et le cadrage changent selon le support ; les visuels restent de véritables réalisations.

L’atelier permet de modifier une composition typographique avec un mot et une encre. Il donne une forme concrète au travail graphique du studio. Pas de dépendance WebGL ou de moteur d’animation pour une interaction qui se satisfait de JavaScript natif.

Sur mobile, le film passe sous le mot principal, les projets deviennent une séquence verticale et l’atelier place les commandes avant l’affiche. La navigation reste utilisable au clavier. Les détails natifs, le dialogue natif, les labels de formulaire, le lien d’évitement et les états de focus assurent une base accessible.

Les 19 routes historiques sont reconstruites et conservent leurs contenus éditoriaux, tarifs et ancres. Trois pages de réalisation sont ajoutées. Les anciens CSS et JavaScript ne sont plus chargés. Une sauvegarde des HTML précédents est conservée hors du dossier publié, dans le répertoire personnel .codex/backups.

## Vérification et limites

`python tools/audit.py` contrôle les fichiers liés, les ancres locales et le titre principal de chaque page. `node --check assets/js/signature.js` contrôle la syntaxe JavaScript.

Le formulaire n’a pas de serveur d’envoi. Il prépare un message, puis propose explicitement email ou WhatsApp. Aucun faux état d’envoi réussi.

La vidéo fournie était déjà présente dans le projet. Elle est utilisée telle quelle ; elle peut être remplacée au même chemin par le film définitif du studio.

Les mesures de rendu et les interactions sont contrôlées dans le navigateur intégré. Sa capture d’écran échoue pendant cette session : le contrôle visuel final et un audit Lighthouse complet restent à effectuer dans un navigateur avec capture disponible. Aucune note de performance ou récompense n’est revendiquée.

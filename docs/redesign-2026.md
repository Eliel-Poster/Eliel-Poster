# Refonte du 3 octobre 2026

## Direction

La demande de refonte complète remplace les anciennes restrictions de mouvement de `motion-guidelines.md`. La version en ligne https://elielposter.com/ sert de référence principale pour le positionnement, les contenus et l'identité : Outfit, Poppins, rouge #c62828, noir #0a0a0a, blanc. Les références https://alejandroha.com/ et https://www.marcuslorenzet.com/ orientent l'échelle typographique et le rythme visuel.

Direction : studio créatif, composition éditoriale asymétrique. Variance 8, mouvement 8, densité 3. HTML/CSS/JavaScript natifs, sans nouvelle dépendance d'animation.

## Architecture

- `style.css` : fondations existantes ; `redesign.css` : identité de la refonte et composants partagés.
- `redesign.js` : menu mobile, thème persistant, apparitions, progression, parallaxe, boutons magnétiques, rideau de navigation et filtres.
- `project-contact.js` : formulaires d'accueil/contact, brouillon local et messages préremplis WhatsApp/email.
- URLs et pages existantes conservées. Portfolio, devis et pages éditoriales partagent la navigation et le pied de page.
- Les explorations de design autonomes gardent leur identité propre.

## Mouvement

Courbe principale : `cubic-bezier(.22,1,.36,1)`. Apparitions des titres échelonnées, révélations au défilement, zoom et overlay des projets, parallaxe limitée à 20 px, boutons magnétiques avec pointeur précis, transition rouge entre pages. Un seul bandeau animé avec commande pause/reprise. Les déplacements sont pilotés par transform et opacity ; scroll échantillonné avec requestAnimationFrame. Aucun détournement du défilement.

`prefers-reduced-motion` désactive animations, transitions, parallaxe et magnétisme. Le contenu reste visible sans JavaScript. Menu : état aria-expanded, fermeture avec Échap et retour du focus. Les liens conservent les clics modifiés et l'ouverture dans un nouvel onglet.

## Formulaires

L'ancien contact simulait une réception sans transmission. Il prépare désormais un message que le visiteur valide dans WhatsApp ou son application email. Aucun message n'est présenté comme envoyé avant sa transmission. Le brouillon reste disponible. Le devis conserve ses champs et sa validation ; la configuration EmailJS existante contient un identifiant de service provisoire, donc une préparation email/Gmail est proposée explicitement. Aucun envoi externe effectué pendant les tests.

## Vérifications

- Syntaxe des trois scripts modifiés/nouveaux : `node --check`.
- Parcours des pages principales dans Chromium, sans erreurs JavaScript relevées.
- Formats mobile 390 px, tablette 820 px, desktop 1440 px ; navigation, thème, accordéons, filtres, préparation des messages et conservation des champs vérifiés.
- Audit statique des liens et ancres sur les 20 pages HTML.
- Lighthouse snapshot desktop : 100/100 en accessibilité, bonnes pratiques et SEO, zéro audit en échec (ne mesure pas les performances).

Le serveur de prévisualisation local peut être lancé avec `python -m http.server 4173 --bind 127.0.0.1`. Aucune publication sur le site public n'est effectuée par cette refonte locale.

## Deuxième direction : ouverture et portfolio immersifs

À la demande de l'utilisateur, le hero avec vignette de projet est remplacé par une composition plein écran, un grand nom du studio et une sculpture de papier rouge. Le manifeste introduit le studio avant les projets. Références : https://gertix.studio/portfolio/ pour les grands tableaux numérotés ; https://alejandroha.com/ pour la signature dessinée et le dévoilement ; https://legencymedia.com/ pour la clarté des présentations.

- `assets/css/immersive.css` et `assets/js/immersive.js` complètent le système partagé uniquement sur l'accueil et le portfolio. Aucune dépendance ajoutée.
- Introduction de 2,5 secondes environ : tracé du symbole réel du favicon, remplissage, retrait du voile rouge, apparition échelonnée du nom. Première entrée de session seulement ; liens profonds et historique préservés. Bouton passer, Échap, restitution du focus et du défilement, garde-fou de 3,2 secondes.
- Deux réalisations en panneaux collants qui se superposent sur ordinateur ; disposition naturelle sur mobile et mouvement réduit. Images des projets existants conservées.
- Portfolio en grands tableaux alternés avec les huit entrées existantes, filtres et liens conservés. Les explorations restent explicitement identifiées. Suppression du décompte contradictoire de dix projets et des statistiques non documentées de l'ancien en-tête.
- Préférence de mouvement réduit respectée ; aucun défilement détourné. Le visuel n'est pas présenté comme un projet client.

Contrôles de cette itération : syntaxe JavaScript et `git diff --check` ; 20 pages HTML sans lien local ni ancre manquants ; largeurs 320, 390, 820 et 1440 px ; filtres 8/1/1/1/5 ; menu et Échap ; cycle complet de l'introduction, sortie anticipée, état inert et verrouillage du défilement restaurés ; préférence JS de mouvement réduit simulée. Lighthouse snapshot : accueil desktop et portfolio mobile clair 100/100 en accessibilité, bonnes pratiques et SEO. Le contrôle sombre a révélé le contraste du filtre actif, corrigé en rouge #c62828. Aucun score de performance n'est revendiqué.

### Visuel de studio généré

Outil intégré imagegen, mode génération. Fichier utilisé : `assets/img/studio-paper.webp` (86 154 octets, 1536 × 1024). Encodage WebP pour la livraison web ; original PNG conservé dans le dossier de génération Codex.

Prompt final :

> Create a high-end art direction hero image for a French graphic design studio. A single large physically plausible sculptural loop made from a broad thick sheet of crimson red paper (#c62828), twisting once into an architectural folded ribbon with straight cut edges, a tactile subtle paper finish, dramatic hard directional studio lighting, deep contact shadows. It should feel like an elegant real gallery sculpture photographed with medium-format camera, not a plastic blob, not a logo, no lettering, no text, no marks. Landscape 3:2 composition, sculpture centered filling 75 percent height, isolated against a clean very light warm gray seamless background, abundant breathing room left and right. Predominantly deep crimson red and warm white only. Very sophisticated minimalist editorial photograph with bold sculptural geometry.

## Sélection finale : trois projets et interactions à la souris

La dernière demande remplace la sélection précédente : **site Abraham Dogo, affiche Master Class d’Adoration, film original Eliel Poster**. L'accueil et le portfolio présentent exactement ces trois projets. Les anciens filtres et les cinq explorations ont été retirés de cette galerie ; leurs pages autonomes existent toujours.

Film : `assets/video/eliel-poster-motion.mp4`, 12 secondes, 1280 × 720, 30 images/seconde, H.264, sans audio, 618 362 octets. Quatre séquences typographiques : une idée / prend forme / du mouvement / signature du studio. Source reproductible dans `tools/render-motion.py` (Pillow, FFmpeg et polices Outfit/Poppins installées). Affiche de lecture `assets/video/motion-studio-poster.webp`. Lecture sur action, commandes natives, téléchargement, description et transcription textuelle sur le portfolio ; arrêt en quittant la fenêtre ou le champ de vision.

`interactive.js` ajoute le relief piloté par la souris, le repère de survol avec suivi amorti et les voiles de révélation des images. Les animations s'arrêtent à l'équilibre ; elles sont désactivées avec un pointeur tactile ou la préférence de mouvement réduit. Le curseur natif reste utilisable.

Sur le grand nom du hero, une zone blanche suit la souris et reste découpée dans les lettres. Un gradient radial local conserve le noir ailleurs. Le repère de survol rouge est masqué sur le nom afin de laisser cet effet visible. La préférence de mouvement réduit désactive aussi ce suivi.

Vérification finale dans Chrome via Playwright : trois projets sur les deux pages ; lecture effective de la vidéo, durée/dimensions confirmées, décodage complet FFmpeg ; aucun débordement à 320, 390, 820 et 1440 px ; ouverture/fermeture du menu avec Échap ; aucun blocage ni effet de pointeur en mouvement réduit ; suivi et découpage blanc du titre vérifiés visuellement ; aucune erreur JavaScript ou ressource locale en échec. Les 20 pages HTML ont des liens et ancres locaux valides. Syntaxe JavaScript et `git diff --check` validés.

## Sculpture du hero en temps réel

Le visuel principal devient un ruban de Möbius modélisé en code, animé en WebGL2 : rotation lente, flottement, orientation amortie suivant le pointeur, glisser-déposer et légère évolution au défilement. Éclairage de studio, reflets mobiles et ombre douce simulée. Les boutons « Tourner » et « Pause / Reprendre » permettent aussi une utilisation au clavier. La typographie, la palette et le reflet blanc dans les lettres restent en place.

`sculpture.js` charge Three.js 0.180.0, hébergé localement dans `assets/js/vendor/` avec sa licence MIT. Aucun modèle, texture ou service externe n'est requis à l'exécution. La photographie reste affichée si WebGL2 est indisponible ou si le contexte graphique est perdu. `sculpture.css` adapte la scène et les commandes aux petits écrans.

Le rendu s'arrête hors écran et lorsque l'onglet est masqué. La densité de pixels est plafonnée ; la géométrie est construite une seule fois. La préférence de mouvement réduit affiche une sculpture immobile et permet une rotation manuelle immédiate. Le défilement tactile reste natif.

Références visuelles consultées : Awwwards (sélection 3D) et Meer Mohsin pour la place donnée à la matière et aux interactions. La géométrie, le code de la scène et la composition Eliel Poster sont propres à ce site.

Contrôles Chrome/Playwright : rendu animé confirmé par comparaison d'images ; image stable en pause et en mouvement réduit ; rotation manuelle et glisser-déposer fonctionnels ; repli photographique testé avec WebGL2 indisponible ; aucun débordement à 320, 390, 820 et 1440 px ; aucune erreur JavaScript ni ressource locale manquante pendant ces parcours. Ces vérifications ne constituent pas une mesure des performances sur téléphone physique.

## 4 octobre : nouvelle DA du hero, référence Filmbot

La direction finalement retenue dans cette itération remplace les compositions précédentes du hero. Référence consultée et inspectée visuellement : https://filmbot.com/. Le principe de l'image en mouvement découpée dans une grande forme est adapté au symbole existant d'Eliel Poster, sans reprendre les médias de Filmbot.

- À gauche, le symbole original agrandi sert de masque à une matière 3D ivoire sur rouge. `assets/img/brand-mark.svg` reprend les tracés du favicon sans son fond. À droite, signature ELIEL POSTER en Outfit, composition typographique dense, message et accès au studio. Sur mobile, le symbole passe au-dessus du titre.
- Le survol blanc des lettres, l'introduction, les contrôles de rotation et pause, le mouvement réduit et le repli sans WebGL restent fonctionnels. `assets/img/sculpture-ivory.png` est un rendu transparent de la scène locale utilisé en secours.
- Les logos restent transparents en thème sombre. La fin automatique de l'introduction ne force plus de focus visible sur le logo ; la sortie au clavier lui restitue toujours le focus.
- Le manifeste devient une grande composition de texte dont la couleur se révèle au défilement avec les animations CSS liées à la vue. En mouvement réduit ou sur navigateur non compatible, le texte reste entièrement lisible et statique.

Validation : comparaison de rendus animés et mis en pause, rotation manuelle, effet blanc, image de secours sans WebGL, fermeture de l'introduction au clavier et restauration du focus ; largeur sans débordement à 320, 390, 820 et 1440 px ; thèmes clair et sombre ; trois projets sur l'accueil et le portfolio ; lecture effective du film ; menu mobile et Échap. Aucun échec JavaScript observé. Audit statique des 20 pages : aucun lien local ni ancre manquants. Syntaxe JavaScript et `git diff --check` passent. Prévisualisation locale uniquement.

## 4 octobre — version 11 : affiche typographique et galerie ouverte

Cette version remplace la direction décrite ci-dessus, à la demande de l'utilisateur de retirer l'animation de fond et de reprendre le hero ainsi que le reste de la page.

- Le hero présente désormais « eliel » en noir et « poster » en rouge, à très grande échelle et décalés, avec une description concrète des activités. Outfit, Poppins et la palette existante sont conservés. Les liens vers les réalisations et le studio restent directement accessibles.
- Le fond animé, l'objet 3D et ses commandes sont retirés de la page. Aucun canvas, script de sculpture ou téléchargement Three.js n'est présent dans le parcours vérifié. Les anciens fichiers restent sur disque mais ne sont plus importés.
- Le survol blanc localisé dans les lettres et l'introduction de première visite restent actifs, avec leurs alternatives clavier et mouvement réduit. Le repère « VOIR » suit uniquement les images liées ; la perspective des panneaux et les voiles sur les médias ont été retirés.
- La galerie de l'accueil et le portfolio gardent exactement trois travaux : site Abraham Dogo, affiche Master Class et film original du studio. Les images occupent de grands formats ; l'affiche et le film utilisent des alignements différents. Les commandes natives de la vidéo sont conservées, sans lecture automatique.
- Services en grands accordéons, méthode en lignes numérotées, témoignage ouvert, contact en deux colonnes et pied de page restructuré. Le formulaire conserve ses champs et prépare le message sans l'envoyer automatiquement.
- Styles de cette direction : `hero.css`, `gallery.css` et `studio-sections.css`, chargés après les styles partagés. `interactive.js` limite désormais le suivi du pointeur aux visuels liés et conserve la pause des vidéos hors écran.

Validation intégrée : largeurs 320, 390, 820 et 1440 px sans débordement ; thèmes clair et sombre ; trois projets sur les deux pages ; lecture effective du film de 12 secondes ; menu mobile et fermeture par Échap ; accordéons et saisie du formulaire ; effet blanc et mouvement réduit. Aucune erreur JavaScript ni ressource locale en échec observée pendant ces parcours. Audit statique : 20 pages, 355 références locales, aucun fichier ni ancre manquant. Syntaxe des scripts et `git diff --check` validées. Le contact a également été inspecté après la fin de son apparition. Aucun score de performance ni test sur téléphone physique n'est revendiqué. Prévisualisation locale : `http://127.0.0.1:4173/index.html?design=11`.

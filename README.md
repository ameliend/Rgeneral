# Registre Général — proposition d’interface

Maquette responsive de la fiche société, en français, réalisée en HTML, CSS et JavaScript natif. Aucun paquet à installer et aucune ressource externe à télécharger.

## Démarrer

Depuis `/workspace/Rgeneral` :

```sh
python3 -m http.server 3000 --bind 127.0.0.1
```

## Fonctionnalités

- Vue d’ensemble, associés, titres, décisions, personnel, documents et préférences.
- Modification locale de la fiche société, conservée dans le navigateur.
- Recherche accessible avec `Ctrl K` ou `⌘ K`, notifications et navigation mobile.
- Export texte de la fiche et CSV de l’actionnariat.
- Formulaires de démonstration qui téléchargent un brouillon local.

Les données sont illustratives. Aucun formulaire ne transmet de données, ne déclenche une formalité ni n’effectue de paiement. Les exports de démonstration (texte, CSV, HTML ou ZIP) sont sans valeur juridique. Les PDF importés sont restitués dans leur format original. Le bouton de réinitialisation se trouve dans « Mon compte ».

La forme juridique et le capital sont repris de la capture initiale à des fins visuelles ; leur cohérence juridique devra être vérifiée avant toute intégration métier.

## Parcours public — proposition HTML

- `landing.html` : accueil public, présentation de la solution, parcours par profil, fonctionnement, accès à la page Offres, FAQ et prise de contact simulée.
- `connexion.html` : connexion, inscription (`#inscription`) et récupération du mot de passe (`#mot-de-passe-oublie`). Les formulaires ne font aucun appel réseau et ne créent aucun compte.

Les deux pages embarquent leur JavaScript et leurs icônes SVG. Le style principal reste embarqué ; les modales partagent maintenant `design-tokens.css` et `modals.css` avec l’application. Aucune police, bibliothèque ni service externe n’est chargé. Garder ces fichiers dans le même dossier pour conserver les liens et le thème des modales. Le lien de démonstration depuis la connexion ouvre le dashboard personnel `dashboard.html`. Chaque société donne ensuite accès à sa fiche dans `index.html`.

Cette proposition prolonge l’interface société approuvée. La lecture du site public `registregeneral.com` a été bloquée par le proxy réseau (HTTP 403) pendant la réalisation : l’architecture proposée reste à confronter à l’arborescence actuelle. Les deux domaines `registregeneral.com` et `www.registregeneral.com` ont été ajoutés au brouillon des paramètres réseau, sans activation du réseau courant. Aucun tarif, témoignage, chiffre de clientèle ou engagement juridique non vérifié n’est présenté comme une information officielle.

### Offres et formalités en accès public

- `offres.html` : Conservation (8 € HT/an/société), Accès (49 €/an/société), Premium (99 €/an/société) et Illimité (299 €/an/société), comparatif complet et contact sur devis pour plus de 15 sociétés.
- `annonce.html` : présentation des annonces légales, événements concernés, préparation interactive des informations, étapes et FAQ.
- `depot.html` : présentation du dépôt des comptes annuels, catégories de pièces à préparer, étapes et FAQ.

Le menu « Les formalités » dessert directement les deux pages publiques ; « Nos offres » ouvre la page dédiée. Les tarifs et le comparatif sont accessibles uniquement sur `offres.html` ; la landing y renvoie depuis sa navigation. Le choix d’une offre ou d’une formalité est affiché sur la page de connexion/inscription via des paramètres d’URL, sans enregistrer de données ni déclencher de souscription.

Les prix, certifications, stockage, fonctionnalités et limites du comparatif proviennent de l’extrait HTML fourni par l’utilisateur. Seule l’offre Conservation portait la mention HT dans cet extrait : le régime fiscal des trois autres prix reste à confirmer. Les textes détaillés des pages originales `/annonce` et `/depot` n’ont pas pu être consultés (blocage réseau) ; les pages créées proposent une présentation du service à valider, sans tarif ou délai inventé ni transmission réelle de formalité.

### Inscription à partir de la recherche de société

La landing propose une recherche par dénomination ou SIREN. Le parcours est : recherche → confirmation de l’identité de la société → préparation du compte → ouverture de l’espace de démonstration prérempli. Il fonctionne également depuis les pages Offres et Formalités et conserve ce contexte pendant l’inscription.

La recherche utilise **uniquement la fiche d’exemple THIRTY**, clairement indiquée dans l’interface. Aucun code, endpoint, paramètre d’authentification ni backend INPI n’était présent dans le dépôt. Aucun appel INPI réel n’est effectué. La saisie manuelle permet de continuer sans résultat. Elle vérifie le format du SIREN (9 chiffres), sans certifier l’existence de l’entreprise.

La société choisie et sa confirmation sont conservées en `sessionStorage` pour ce parcours. Après l’action explicite d’ouverture de la démonstration, ses informations préremplissent la fiche via `localStorage` (`rg-demo-company`). Les champs manquants restent « À renseigner ». Les noms et prénoms saisis à l’inscription sont utilisés dans la session de démonstration. L’adresse e-mail et le mot de passe de ce formulaire ne sont ni stockés ni transmis. Les modifications explicites du profil depuis Mon compte sont conservées localement, comme indiqué dans cette page.

Pour le raccordement réel, prévoir un adaptateur serveur vers l’API INPI existante, avec les secrets côté serveur, puis le backend de création et de vérification du compte. Une entreprise trouvée dans les données publiques ne prouve pas les droits d’accès à ses documents privés ; ces droits doivent être vérifiés séparément. La présente maquette n’effectue aucune authentification réelle, souscription ou vérification d’adresse e-mail.

Le header public ne comporte plus « Pour qui ? » ; la section des profils reste sur la landing. Les liens de connexion et de parcours cabinet sous la recherche ont été retirés. Le logo est écrit « Registre Général » sur toutes les pages.


## Dashboard personnel et sociétés

- `dashboard.html` : accueil personnel, nom/prénom, sociétés ajoutées, notifications et accès à Mon compte.
- `societe.html?societe=<identifiant>#societe` : fiche d’une société, avec la mise en page existante ; le menu Mon espace retourne au dashboard.
- Le header public « Se connecter » et la soumission du formulaire de connexion ouvrent le dashboard dans cette maquette. Aucune authentification réelle n’est effectuée.
- L’ajout d’une société se fait dans le dashboard ou le sélecteur latéral, avec un SIREN de 9 chiffres. Les doublons sont refusés. La recherche et le tri portent sur les sociétés déjà ajoutées.
- `rg-demo-companies` conserve les fiches séparées en localStorage, `rg-demo-selected-company` mémorise la sélection, `rg-demo-notifications-read` l’état de lecture. L’ancienne clé `rg-demo-company` est reprise pour préserver les fiches déjà saisies et le parcours d’inscription.
- Seule THIRTY contient les registres illustratifs initiaux. Les nouvelles sociétés affichent leurs propres coordonnées et des registres vides, sans recopier le capital, les associés ou les documents de THIRTY.
- Mon compte permet de modifier le prénom, le nom et une adresse e-mail facultative. Ces modifications sont enregistrées uniquement dans le navigateur (`rg-demo-profile`), sans transmission à un serveur. Les mots de passe ne sont jamais stockés.


### Fiche société modernisée

`societe.html` reprend la présentation de la capture dans le style de l’espace personnel : identité, SIREN, informations générales, chiffres clés, formalités accessibles depuis la navigation, capital et actionnariat, activité et abonnement. Les cartes du dashboard et le sélecteur latéral ouvrent cette page. `index.html` reste une autre entrée vers la même interface partagée.

L’offre historique « Carnet » et son plafond de 5 certifications sont repris de la capture pour THIRTY. Le solde négatif de la capture est remplacé par « Solde à confirmer », sans inventer un solde disponible. Les nouvelles sociétés n’héritent ni de cette offre ni du capital ou des associés de THIRTY. Les factures affichent un état vide et l’achat de certifications télécharge uniquement une demande de démonstration ; aucun paiement n’a lieu.


### Onglet Associés

`associes.html` ouvre directement l’aperçu de l’actionnariat de la société sélectionnée. L’onglet Associés dans `societe.html` ouvre la même vue ; `#associes/<identifiant>` affiche une fiche individuelle.

Les captures d’origine décrivaient Amélien Delahaie (249 titres) et Steve Rodgers (751 titres), pour 1 000 actions ordinaires de 1 €. Le jeu de volume actuel remplace la détention de démonstration par 20 comptes de 50 titres chacun (5 %). L’historique fourni des deux premiers comptes reste consultable ; l’écart avec le nouveau solde fictif est explicitement signalé sans inventer d’opération.

Fonctions disponibles dans la maquette : recherche par nom ou compte, tri du tableau, export CSV de la liste complète et de la table de capitalisation, consultation et modification des fiches, ajout d’un associé, modification du nombre total de titres et de la valeur nominale, recherche et détail du type de titres. Les exports complets ne dépendent pas du filtre affiché. Le capital et les parts sont calculés à partir des mêmes données, conservées par société dans `rg-demo-companies` (champ `ownership`).

Un associé peut être créé avec 0 titre. L’attribution ne peut pas dépasser les titres disponibles ; le total émis ne peut pas descendre sous les titres déjà attribués. Le reliquat apparaît comme « Titres non attribués ». La page société reprend automatiquement la répartition et les chiffres modifiés. Les nouvelles sociétés ne reçoivent pas les associés de THIRTY.

Ces opérations modifient uniquement les données locales du prototype. Elles n’émettent aucun titre juridiquement et n’enregistrent aucun mouvement auprès d’un organisme. Le registre des mouvements de titres reprend désormais les quatre lignes de l’extrait fourni. Les nouveaux projets restent des brouillons et ne modifient pas les soldes de l’actionnariat.


### Navigation, abonnement et mise à jour des informations

Les trois registres (titres, décisions, personnel) sont regroupés sous le menu déroulant « Registres ». « Mes formalités » donne accès aux formulaires de dépôt des comptes annuels et d’annonces légales, ainsi qu’au suivi des procédures. Les menus se ferment à la sélection, au clic extérieur ou avec Échap, et restent utilisables au clavier et sur mobile. La barre d’accès rapide a été retirée.

Le bloc abonnement utilise une carte avec bandeau vert forêt, informations de certifications, action d’ajout de certifications et liens de facturation/offres. Le solde historique demeure à confirmer.

La modale « Informations générales » propose « Saisie manuelle » et « Mise à jour automatique ». Cette dernière est une simulation locale : elle compare cinq champs publics à la fiche d’exemple THIRTY, permet de choisir les différences à préremplir, puis revient à la saisie pour relecture et enregistrement explicite. Elle préserve les champs non sélectionnés, les modifications manuelles et la clôture de l’exercice. Aucun appel INPI n’est effectué. Un autre SIREN sans fiche de démonstration conserve l’accès à la saisie manuelle.

La vue société conserve « VOTRE ESPACE JURIDIQUE », affiche désormais la dénomination de la société en titre et ne présente plus la description générique. La barre supérieure de l’application a été retirée ; les accès personnels restent dans la navigation latérale et un bouton ouvre le menu sur mobile.


### Fiche individuelle et compte d’associé papier

`associe.html` ouvre directement le compte n° 1 de la société sélectionnée ; les autres fiches restent accessibles via `#associes/<identifiant>` et depuis l’aperçu des associés.

La fiche comporte les champs de la capture : civilité, prénom(s), nom de famille, nom d’usage, date et lieu de naissance, adresse, coordonnées, titres détenus et statut d’authentification. Les informations fournies pour Amélien sont reprises comme données de démonstration (09/06/2009, Rennes). Les champs absents restent non renseignés. La modale d’identité prend en charge les personnes physiques et morales.

Le compte est présenté comme un feuillet papier : cartouches d’identité de société et de titulaire, numéro de compte, mode de détention et information complémentaire ; tableau à en-têtes groupés avec opérations, nature/nom des titres, acquis, radiés, soldes et observations. Les trois opérations de la capture sont reprises pour Amélien (11/01/2023 : +500 ; 15/05/2023 : −250 ; 22/05/2024 : −1 ; solde 249). Les quatre lignes du registre de titres fourni permettent également de restituer les trois opérations de Steve Rodgers (+500, +250, +1, solde 751). Aucun historique supplémentaire n’est inventé. Si la détention actuelle diffère du dernier solde historique, l’écart est signalé sans ajout de mouvement fictif.

`account-paper.css` contient le design du feuillet et l’impression paysage. Le bouton de téléchargement produit un HTML autonome ; Imprimer / PDF isole le compte papier pour l’impression native du navigateur. Sur mobile, le feuillet conserve sa structure et défile horizontalement dans son propre cadre.

Les cartouches du compte sont modifiables (numéro unique, mode de détention, informations). Ils sont conservés avec l’identité et l’historique dans les données locales `ownership` de chaque société. Les identifiants de route sont stables même si le numéro de compte change.

L’invitation télécharge uniquement un brouillon, sans envoyer d’e-mail ni authentifier le titulaire. L’attestation de participation est un spécimen HTML explicitement marqué sans valeur juridique, non signé et non certifié. Aucun service externe ni outil d’authentification réel n’est appelé.


### Trois registres modernisés

Les trois vues sont accessibles depuis le menu « Registres » et disposent d’entrées HTML directes :

- `registre-titres.html` : quatre mouvements fournis, titulaires et bénéficiaires avec accès aux comptes papier, recherche, filtres avancés, export CSV des résultats, rectification locale des dates/observations, familles d’opérations et projets en attente. Les deux projets et deux dates de certification de l’extrait sont repris.
- `registre-decisions.html` : aperçu des registres, assemblées générales, direction, conseil et registres personnalisés. Les six PV fournis sont classés dans leurs années d’origine. Ajout/remplacement de PDF, document contenant un ou plusieurs PV, commentaires, pièces jointes, détails et préparation locale d’un brouillon de signature. L’année la plus récente s’ouvre à la sélection d’un registre.
- `registre-personnel.html` : salarié fourni (entrée le 22/11/2019), recherche, tri, filtre par établissement, ajout/modification, contrôle des dates et documents liés. Les annexes stagiaires et travailleurs étrangers/détachés sont conservées séparément. Les données absentes ne sont pas déduites des fiches d’associés.

`registers.js` contient les données initiales, les interactions et les exports ; `registers.css` conserve le style vert forêt et ivoire de l’espace société, avec défilement interne des tableaux sur mobile. Chaque registre conserve ses données indépendamment pour chaque société dans `rg-demo-companies`. Les nouvelles sociétés démarrent avec des registres vides.

Les fichiers PDF (10 Mo maximum par fichier, extension et en-tête PDF vérifiés) sont conservés uniquement dans IndexedDB, base `rg-demo-register-files`. Leur nom et leur rattachement sont mémorisés avec le registre. Ils restent téléchargeables après rechargement dans le même navigateur et la même origine. Les copies de registres antérieurs et les pièces liées aux personnes utilisent le même mécanisme. Effacer les données du navigateur supprime cette conservation locale ; il ne s’agit pas d’une sauvegarde serveur.

Les anciennes certifications et les mentions d’horodatage/signature proviennent des extraits fournis. Leurs fichiers originaux n’étant pas joints, l’interface ne génère pas de faux PDF historiques. « Préparer la certification » crée une **simulation** locale, clairement identifiée, qui fige les données du registre sans consommer de certification. Le projet et le spécimen sont exportés en HTML ; le dossier ZIP d’une simulation contient ce spécimen et les PDF locaux disponibles, sans concaténer ou modifier ces PDF. Aucun horodatage, certificat, signature, e-mail ou formalité réelle n’est produit.

Validation : parcours Chromium des trois pages, recherche/filtres/CSV, projets et rectifications, cohérence avec les comptes papier, fichiers PDF persistés et restitués à l’identique, brouillon de signature, intégrité du ZIP, personnel/annexes, isolation entre sociétés et affichage à 1440, 1024, 768, 390 et 320 px. Aucun service externe n’est nécessaire.


## Charte graphique et design system — v1.0

Le guide d’intégration est disponible dans `DESIGN-SYSTEM.md`. Le fichier `registre-general-kit-design-v1.zip` réunit les guides, les ressources et la maquette pour conserver tous les liens d’exemple.

- `charte-graphique.html` : identité visuelle, principes, règles du logo, palette, typographie, composition, iconographie, ton et contrastes de référence.
- `charte-graphique.pdf` : version imprimable et partageable de la charte.
- `design-system.html` : catalogue interactif de boutons, formulaires, navigation, tableaux, statuts, cartes, abonnement, modales, notifications et compte papier.
- `design-tokens.json` : valeurs typées (couleurs, familles typographiques, espacements, rayons, dimensions, durées et seuils responsive).
- `design-tokens.css` : variables préfixées `--rg-`, synchronisées avec le JSON.
- `design-system.css` : styles du catalogue et classes réutilisables `.rg-*`.
- `design-system.js` : interactions de démonstration du catalogue uniquement, sans appel réseau et sans accès aux données métier.
- `brand-assets/` : logo principal, inversé, monochrome et symbole en SVG. Le texte du logo reste éditable et dépend de Segoe UI / Arial ; vectoriser la version typographique retenue avant impression définitive.

La bibliothèque formalise l’UI approuvée et améliore les valeurs de référence des futurs composants : texte courant de 16 px, libellés/tableaux de 14 px, métadonnées de 12 px, contrôles standard de 44 px et couleurs de texte offrant les contrastes documentés. Le sauge reste décoratif. Les statuts de certification, d’import et de simulation sont distingués par des mots et des couleurs.

Les pages existantes conservent leurs styles et comportements hors des modales. Celles-ci adoptent la référence via `modals.css`, une adaptation ciblée sans charger le catalogue. `design-system.css` définit une base globale de mise en page et de typographie : son adoption dans un écran historique demande une revue CSS. Charger les tokens seuls ne remplace pas les anciens styles. Aucune police ou bibliothèque externe n’est téléchargée. Les interfaces de démonstration du catalogue ne stockent aucune saisie et ne réalisent aucune opération juridique.

Pour consulter : servir le dossier avec la commande locale ci-dessus puis ouvrir `/charte-graphique.html` ou `/design-system.html`. Garder les fichiers CSS/JS et `brand-assets/` à côté des HTML. Les exports du compte d’associé et le PDF de la charte restent autonomes.


### Adoption du design system dans les modales

Les huit entrées authentifiées et les cinq pages publiques chargent `design-tokens.css` puis `modals.css` après leurs styles existants. Cette feuille est limitée aux dialogues `#modal`, `#dialog` et `#privacy` : surface blanche explicite et `color-scheme: light`, texte Encre/Secondaire, voile vert transparent, coins de 18 px, contrôles et boutons de 44 px, champs blancs, focus et bordures visibles. Les formulaires longs défilent dans la modale ; l’en-tête reste visible et les actions des formulaires authentifiés restent accessibles en bas. Les dialogues sont reliés à leur titre accessible.

L’ajout de société, l’édition manuelle et la simulation de mise à jour automatique utilisent cette présentation. Elle s’applique aussi aux associés, aux registres, aux formalités et aux dialogues publics. Aucun contrôleur métier n’a été remplacé par le JavaScript de démonstration du design system.

Vérification : fond blanc sous thème sombre forcé à la racine, huit entrées authentifiées, cinq entrées publiques, ajout de société et enregistrement des informations, comparaison/préremplissage simulé, fermeture Annuler/Échap, largeur de 320 à 1 440 px et parcours des trois registres.


## Jeu de volume et sous-navigation des associés

`demo-fixtures.js` ajoute dix sociétés fictives à THIRTY (onze sociétés au total dans un espace neuf), avec des noms, coordonnées et identifiants de test clairement signalés. Les autres sociétés déjà saisies sont conservées. THIRTY comporte vingt associés de démonstration, chacun avec cinquante des mille titres, soit 5 %. Les deux noms fournis sont conservés et dix-huit noms fictifs complètent les vingt comptes.

Cette migration s’exécute une seule fois par navigateur (`rg-demo-volume-v1`). Le précédent actionnariat de THIRTY est conservé dans `rg-demo-before-volume-v1`. Les modifications effectuées après la migration ne sont pas réinitialisées au rechargement. Les historiques des registres fournis sont préservés ; les nouveaux comptes n’ont pas d’opérations inventées.

`subnav.css` et `subnav.js` constituent le composant partagé avec `design-system.html#sous-navigation` : vue d’ensemble toujours disponible, trois fiches maximum et bouton « Tous les associés » ouvrant une liste recherchable de huit résultats par page. La sélection active reste visible après navigation/redimensionnement ; les accès directs conservent la navigation clavier (gauche/droite/Début/Fin). Il conserve des liens avec `aria-current`, plutôt que de simuler des onglets de panneaux. La répartition du capital dispose d’un défilement interne pour éviter une carte démesurée.

La barre supérieure de l’application est retirée. Les sociétés utilisent leur nom comme titre au lieu de « Ma société » ; la description générique et le bouton supérieur « Nouvelle procédure » ne sont plus affichés. L’ajout d’associé et l’ajout de société restent disponibles. Les formalités restent accessibles par leur menu. Le bouton mobile ouvre/ferme la navigation latérale avec un état `aria-expanded` synchronisé.

Validation : migration d’un espace existant et conservation d’une société étrangère au jeu, absence de doublons au rechargement, onze cartes, vingt comptes égaux et total de 1 000 titres, filtres, sélection directe et liens profonds, focus clavier, fiche active visible après redimensionnement, catalogue partagé et absence de débordement de 320 à 1 440 px.


## Collections paginées et accès compact aux associés

`collections.js` / `collections.css` fournissent la pagination partagée avec le catalogue. Le dashboard affiche 6 sociétés par page (choix 6/12/24), et le tableau des associés 10 lignes (choix 10/20/50). Les recherches et tris s’appliquent à l’ensemble des données avant découpage et reviennent à la première page. Les bornes et le total filtré sont annoncés ; le nombre de boutons de pages reste limité. Les exports complets des associés ne sont pas limités à la page visible. Après ajout d’une société, le filtre est effacé et la nouvelle fiche apparaît en tête via le tri « Dernière ajoutée ».

La sous-navigation est limitée à l’aperçu et trois fiches (fiche active / derniers accès / premiers raccourcis), même pour 1 000 associés. « Tous les associés » ouvre une modale blanche avec recherche par nom ou compte, huit résultats par page, état vide, fermeture par Échap et retour du focus. Le composant conserve des liens de navigation réels et est documenté dans `design-system.html#sous-navigation`. La pagination dispose également d’une démonstration dans `#pagination`. Les dernières fiches sont conservées en mémoire par société, sans nouvelle donnée personnelle persistée.

Les données restent locales : la pagination découpe les collections du prototype, sans requête de pagination serveur. Le chargement conserve jusqu’à 1 000 sociétés et 1 000 associés par société. Le scénario de vérification a utilisé 211 sociétés et 1 000 associés tout en ne rendant que la page courante et trois raccourcis de navigation.

## Caractéristiques des projets d’opérations

`operations.js` / `operations.css` adaptent l’éditeur de projets du registre de titres aux éléments fournis :

- Toutes les opérations : nom facultatif (le type sert de libellé si le nom est vide), date, observation et documents liés. Les PDF existants restent téléchargeables et peuvent être retirés du projet. Maximum 10 PDF de 10 Mo par projet, extension et en-tête PDF vérifiés, conservation dans l’IndexedDB déjà utilisé par les registres.
- Augmentation : émission de titres ordinaires et catégories d’actions de préférence (nom, quantité, droit de vote et coefficient éventuel, dividende prioritaire), ou modification de valeur nominale avec rappel de la valeur actuelle. L’aperçu additionne ordinaires et préférences ; une émission entièrement préférentielle est possible avec 0 titre ordinaire.
- Réduction : diminution du nombre de titres, ou nouvelle valeur nominale inférieure à la valeur courante. L’expression « réduction par émission » de l’extrait est présentée comme une réduction du nombre, pour ne pas suggérer une émission supplémentaire.
- Division / regroupement : facteur, nouvelle valeur nominale et nouveau nombre de titres calculés. Les résultats non entiers du regroupement sont refusés ; les rompus éventuels au niveau des comptes sont signalés.
- Conversion : titulaire, catégorie source actuellement renseignée, catégorie de destination, nom éventuel de destination et quantité à convertir, bornée à la détention actuelle.

Les paramètres et références de PDF sont conservés avec chaque brouillon dans `registers.titles.drafts` et sont repris après rechargement. Les projets préexistants conservent leur quantité et leurs informations. Les valeurs nominales calculées sont affichées jusqu’à six décimales, à titre indicatif. Enregistrer un projet ne modifie ni l’actionnariat, ni le capital ni l’historique des mouvements, et ne crée aucune opération juridique réelle.

Validation : pages limites, recherche depuis une autre page, total filtré, export complet, accès à un associé éloigné, Échap/focus, stress 211/1 000, nominal/émission/préférences/conversion, PDF restitué à l’identique, reprise des paramètres, refus d’un PDF vide, absence de modification de l’actionnariat et rendu jusqu’à 320 px.


## Administration et gestion des droits

`administration.html` ouvre la nouvelle rubrique, également accessible après « Documents sociaux » sur toutes les pages société. La sous-navigation ouvre « Gestion des droits » et conserve les anciennes « Préférences ». Le contenu est réparti en Personnes, Rôles et Invitations en cours pour garder les listes lisibles et paginées.

`administration.js` / `administration.css` gèrent ce modèle local :

- **Qualités** : dirigeant, mandataire, associé, auditeur et indivisaire. Plusieurs qualités peuvent appartenir à la même personne. Les associés sont rapprochés de leurs comptes sans recevoir automatiquement un rôle ; leur qualité d’associé est synchronisée depuis l’actionnariat.
- **Rôles nommés** : création, description, grille de permissions, duplication et modification. Les niveaux exclusifs sont Aucun accès, Lecture seule et Lecture et écriture ; l’écriture inclut la lecture. Les commandes globales préremplissent toute la grille avant les ajustements par fonctionnalité.
- **Fonctionnalités** : société, associés, titres, chaque registre de décisions existant ou personnalisé, personnel et annexes, documents sociaux, dépôt, annonces, suivi des formalités, certifications, personnes/droits, carnet d’adresses, facturation et préférences.
- **Attribution** : un rôle réutilisable par personne, modifiable individuellement ou attribuable à plusieurs personnes avec sélection conservée entre pages et recherches. Les qualités restent indépendantes du rôle. Modifier un rôle met à jour toutes ses références locales.
- **Suppression d’un rôle** : choix explicite d’un rôle de remplacement ou d’aucun accès pour les personnes et invitations concernées. Le rôle et le compte « Propriétaire de l’espace » sont protégés dans le modèle d’interface.
- **Invitations** : préparation d’un brouillon texte, rôle prévu, qualités, contrôle des adresses déjà présentes, reprise et annulation locale. Les invitations annulées restent consultables via le filtre d’état. Aucun bouton ne transmet de message.

Le modèle `access` est normalisé et mémorisé dans l’entrée de chaque société de `rg-demo-companies`. Les fonctionnalités d’un nouveau registre de décisions sont sans accès par défaut dans les rôles personnalisés ; le propriétaire conserve tous les niveaux d’écriture. Les permissions du carnet d’adresses préparent le périmètre issu de l’extrait, sans créer un nouveau service de carnet d’adresses.

THIRTY fournit un exemple avec les vingt comptes d’associés, des qualités supplémentaires fictives, un mandataire, un auditeur, un indivisaire et deux invitations d’exemple. Les autres sociétés commencent avec le profil propriétaire, sans ces personnes et invitations fictives. Les autres données saisies dans l’application sont conservées.

Cette interface prépare une politique d’accès ; **elle n’authentifie pas les personnes et n’applique pas d’autorisations à des comptes réels**. Une application réelle devra vérifier l’appartenance et les permissions côté serveur à chaque opération. Les dates/statuts des invitations d’exemple ne prouvent aucun envoi ; les nouvelles invitations restent des brouillons. Les validations protègent le modèle local, pas une infrastructure d’authentification.

Validation : cinq qualités, création et grille trois niveaux, attribution multiple conservée à travers les recherches, modification partagée, nouveau registre sans accès, brouillons/duplicats/annulation, suppression avec remplacement, propriétaire protégé, rechargement, isolation entre sociétés, anciennes préférences et affichage de 320 à 1 440 px.


## Parcours des opérations : saisie, vérification, fiche

`operation-flow.js` complète l’éditeur de `operations.js`. Toutes les familles passent par la même étape de vérification, avec retour à la saisie sans perte des champs ni des PDF sélectionnés, puis confirmation et fiche dédiée. Les routes `#operation/<identifiant>` sont durables dans le navigateur ; `operation.html?societe=<identifiant>#operation/<identifiant>` fournit une entrée HTML directe. Le registre liste désormais « Opérations et projets » et distingue les projets confirmés des brouillons d’origine.

La cession comporte titulaire et bénéficiaire existants, création préparatoire d’une personne physique ou morale, type/nom des titres renseignés pour la société, quantité, date, prix total et prix par titre. Le dernier prix saisi pilote le calcul. Les calculs monétaires utilisent des entiers (centimes et millionièmes d’euro) : total arrondi au centime, unité affichée jusqu’à six décimales. Une cession vers soi-même ou dépassant la détention connue est refusée. La détention d’un nouveau titulaire reste à vérifier et n’est pas inventée.

Les nouvelles personnes sont préparées en mémoire, visibles dans les sélecteurs, puis ajoutées comme comptes à zéro titre uniquement à la confirmation. Annuler n’ajoute aucun compte. Un SIREN de personne morale facultatif est conservé avec la fiche ; aucune vérification INPI n’est faite. La confirmation enregistre un projet confirmé de démonstration, sans transfert de titres ni changement du capital.

La fiche conserve une photographie de la société, des personnes et des effets prévus, les caractéristiques propres au type d’opération, les observations, les documents et le numéro de version. Elle est rechargeable, exportable en HTML autonome et modifiable via un nouveau passage au récapitulatif. Une édition annulée laisse la dernière version confirmée intacte. Les confirmations échouées sur le stockage local restent sur le récapitulatif et sont réessayables sans doublon. Les traitements de documents sont liés à leur session pour qu’une annulation ne remplace pas une nouvelle saisie.

### Documents automatiques de cession

Le bouton « Préparer l’ordre de mouvement et le CERFA » ajoute deux HTML imprimables aux pièces liées :

- `ordre-mouvement-brouillon.html` : projet non signé d’ordre de mouvement avec société, parties, titres, prix et emplacements de signature.
- `preparation-cerfa-2759-non-officielle.html` : **fiche de préparation**, pas une reproduction ou un préremplissage du formulaire officiel 2759-SD. Elle récapitule les données disponibles, laisse visibles les informations manquantes et donne le lien vers impots.gouv.fr. Aucun droit fiscal ni régime d’exonération n’est calculé.

L’accès au site fiscal a été refusé par le proxy de l’environnement (HTTP 403) pendant la réalisation ; aucun modèle officiel vérifié n’a été intégré. Le raccordement au formulaire officiel reste à faire avant de parler de CERFA généré. Les documents sont régénérés avec les dernières valeurs lors de la vérification, conservés dans IndexedDB et téléchargeables après rechargement. Les pièces PDF importées restent restituées à l’identique. Les HTML exportés peuvent être imprimés en PDF via le navigateur.

Validation : prix total/unitaire et arrondis, génération/régénération, téléchargement, retour de récapitulatif, annulation pendant un traitement, création physique/morale différée, persistance du SIREN, échec de sauvegarde réessayable, toutes les familles d’opérations, lien direct et rendu de 320 à 1 440 px. Les titres et mouvements source restent inchangés.

## Renseignement du capital en six étapes

Le CTA « Renseigner le capital » de la carte Capital & actionnariat ouvre `capital-setup.js` / `capital-setup.css`. Le même parcours remplace l’ancien petit formulaire de modification du capital.

1. Déclaration d’un registre antérieur et import d’une copie PDF si oui (10 Mo maximum, en-tête vérifié, fichier conservé dans IndexedDB). Une copie déjà importée peut être consultée ou remplacée. Aucun contenu n’est extrait automatiquement.
2. Date de création, capital social, valeur nominale commune et nombre d’actions de préférence. Les montants sont saisis au centime dans ce parcours ; le capital doit être égal au total des titres multiplié par la valeur nominale.
3. Total des titres et catégories d’actions de préférence : nom distinct, quantité, droit de vote oui/non avec coefficient, dividende prioritaire oui/non. Les catégories de préférence doivent couvrir le nombre déclaré à l’étape précédente.
4. Personnes physiques, personnes morales et indivisions ; identité, nom d’usage, dénomination/nom de l’indivision, titres répartis par catégorie, nombre de bons, puis informations facultatives (adresse, e-mail, état civil, naissance, numéro de compte unique ou automatique). La liste est limitée à huit lignes par page. Les bons restent hors capital. Toutes les catégories doivent être entièrement attribuées avant de terminer.
5. Observation facultative, jusqu’à 2 000 caractères.
6. Récapitulatif avec les droits de chaque catégorie et les informations de chaque compte, accessibles dans des volets. La validation globale est répétée à l’enregistrement, y compris après un retour direct entre étapes.

La situation est préparée en mémoire ; seuls les binaires PDF temporaires peuvent être stockés avant confirmation. Annuler n’enregistre aucune modification de société. La confirmation sauvegarde ensemble capital, catégories, comptes, observation et référence du registre antérieur. Un échec du stockage conserve le récapitulatif pour réessayer sans doublon. Les comptes existants et les historiques restent conservés ; le parcours ne crée aucun mouvement, acte ou certification. Une copie déclarée absente est dissociée du registre courant à la confirmation, sans supprimer son binaire historique.

Le modèle `ownership.categories` conserve les catégories ; chaque compte porte `holdings` et `warrants`, et `ownership.setup` l’observation et la date de mise à jour. Les anciens modèles à une seule catégorie restent pris en charge. Les vues associés/titres et les cessions/conversions lisent les catégories déclarées ; une cession est bornée à la détention connue dans la catégorie choisie. La carte de synthèse affiche cinq participations maximum puis un lien vers le détail complet. Pour un capital comportant des catégories, modifier ou ajouter un associé reprend le même parcours afin de conserver la cohérence des répartitions.

## Navigation entre site et références

`design-switcher.js` / `design-switcher.css` ajoutent « Explorer » en bas à droite des 17 entrées HTML. Le menu contient Le site, Design system et Charte graphique, indique l’espace courant et se ferme avec Échap ou au clic extérieur. Le retour au site retrouve sa dernière page dans l’onglet, société et sous-page comprises. Il est masqué à l’impression.

Les boutons de téléchargement des guides, du kit et des ressources ont été retirés du design system et de la charte, ainsi que la commande d’impression de la charte. Les sources restent dans le dépôt ; le menu de revue sert à consulter les pages. La navigation latérale d’une société conserve uniquement Ma société sous le sélecteur : formalités et documents restent dans la navigation de contenu.

Validation complémentaire : parcours complet avec trois natures d’associé, préférence avec vote et dividende prioritaire, bons hors capital, conservation des données au rechargement, PDF invalide refusé et copie valide restituable, 20 associés paginés, échec de sauvegarde réessayable, validation globale après saut entre étapes, annulation, historique intact, cession par catégorie, 17 pages sans erreur JavaScript, menu clavier et rendu mobile.

## Groupes, cabinets, portefeuilles et licences

La branche `feature/groupes-cabinets-portefeuilles` ajoute `organisation.html`, accessible dans la sidebar et depuis l’administration d’une société. Chaque cabinet représente un sous-groupe d’un groupe ; la société garde un rattachement principal et sa propre licence.

`organizations.js` / `organizations.css` fournissent cinq vues :

- **Portefeuille** : recherche, filtres de licence et responsable, pagination à dix sociétés, rattachement, licence, payeur et responsables. La sélection multiple est conservée entre pages/recherches et effacée au changement de périmètre. Une modification de licence individuelle ou collective passe par un récapitulatif avant enregistrement.
- **Cabinets** : création et modification d’un sous-groupe, administrateurs propres au cabinet et accès à son portefeuille. Un nouveau groupe est créé avec son premier cabinet et des attributions distinctes d’administration et de gestion juridique pour le compte de démonstration.
- **Équipes et périmètres** : rôles attribués au groupe, au cabinet ou à une société précise. Une personne peut cumuler des attributions différentes. Le tableau suit le périmètre du cabinet choisi, en conservant les attributions de groupe qui le couvrent. Les propriétaires initiaux des groupes sont protégés ; retirer une autre attribution conserve toutes les autres.
- **Rôles et accès** : administration de groupe, administration de cabinet, consultation juridique, gestion juridique et rôles personnalisés. Un rôle personnalisé appartient à son groupe, avec trois niveaux par fonctionnalité. Les rôles de référence sont protégés. L’inspecteur vérifie une personne, une société et une fonctionnalité, puis présente permission du rôle ∩ plafond de la licence = accès effectif.
- **Licences et facturation** : répartition des licences et des payeurs (groupe/cabinet/société), tarifs annuels connus et nombre de certifications prévu par offre. Il n’y a ni facture, paiement, souscription ni solde consommé fictivement présenté comme réel. Les tarifs non fournis restent à confirmer ; le total n’est pas un devis et le traitement fiscal reste à confirmer.

Le contexte groupe/cabinet est mémorisé dans le navigateur et filtre le dashboard, ses notifications, le sélecteur de sociétés et le portefeuille. Le sélecteur de sociétés recherche dans le périmètre et affiche huit résultats par page. Un lien direct vers une société aligne le contexte sur son cabinet principal si elle n’est pas déjà visible dans le périmètre courant. Les anciennes données des sociétés et les registres restent conservés.

Un dossier peut être partagé avec un autre cabinet **du même groupe**, sans créer de nouvelle société ni modifier son payeur ou sa licence. Le partage plafonne les permissions des rôles juridiques du cabinet destinataire à lecture ou lecture/écriture ; il ne crée pas de droit juridique pour ses administrateurs. Un transfert de cabinet principal dans le même groupe conserve les comptes et l’historique. Les droits spécifiques à la société restent attribués ; les droits provenant de l’ancien cabinet ne se déplacent pas automatiquement. La responsabilité du suivi d’un dossier ne constitue pas une autorisation d’accès.

### Modèle et portée de la démonstration

L’organisation est enregistrée dans une entrée locale distincte, `rg-demo-organizations-v1` : groupes, cabinets, personnes, rôles, attributions (`scope`, `scopeId`), rattachements/licences/payeurs/responsables, partages et contexte. Les données juridiques restent dans le modèle existant des sociétés. Une modification d’organisation est écrite en une fois et rétablie en mémoire en cas d’échec du stockage. L’ajout d’une société rétablit la collection précédente si l’enregistrement de son rattachement échoue.

Deux groupes et quatre cabinets fictifs répartissent les onze sociétés de démonstration, avec plusieurs licences dans un même portefeuille. Les sociétés utilisateur déjà présentes ne reçoivent pas de licence payante supposée ; elles sont rattachées au cabinet initial avec « À attribuer ». THIRTY conserve une licence Carnet historique dont le tarif reste à confirmer. Les plafonds de licence sont une politique d’interface de démonstration : Conservation limite aux données en lecture, Accès/Carnet limitent l’édition des documents sociaux et la création de registres sur mesure, Premium/Illimité les autorisent selon le rôle. Les formalités restent des services distincts, soumis à leurs permissions. Une société sans licence peut compléter ses informations générales mais doit recevoir une licence pour ses registres.

Les rôles juridiques de l’organisation sont des attributions nominatives, distinctes des qualités et comptes d’associés et de l’ancien carnet de personnes de chaque société. Le rapprochement de ces identités avec des comptes authentifiés doit être réalisé côté serveur. L’inspecteur ne connecte pas la personne sélectionnée : il calcule ses permissions dans le modèle. La maquette continue d’être utilisée par le profil propriétaire de démonstration. Les vues de société indiquent les espaces indisponibles ou en lecture seule ; les contrôles de modification correspondants sont désactivés.

**Cette branche reste une maquette HTML locale.** Le navigateur contient les jeux de données et ne fournit aucune isolation de sécurité réelle. Une application de production doit authentifier les membres, isoler les données par groupe et vérifier à chaque requête le périmètre, les permissions et les droits contractuels. Aucun e-mail n’est envoyé par l’ajout d’une attribution.

Vérifications : création groupe/cabinet/société, transfert avec récapitulatif, conservation des registres, partage sans duplication et plafond de lecture, rôles différents selon les cabinets, rôle personnalisé limité à son groupe, licence individuelle/collective, échec de sauvegarde réessayable, sélection sur plusieurs pages, 44 sociétés de volume, filtrage du dashboard/sélecteur/notifications, lien direct, rechargement, 18 entrées HTML, cinq sous-pages de 320 à 1 440 px et non-régression des parcours capital/opérations.

Tests du modèle sans dépendance :

```sh
node tests/organizations-model.test.cjs
```

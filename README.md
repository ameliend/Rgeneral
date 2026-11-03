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

Les deux pages embarquent leur CSS, leur JavaScript et leurs icônes SVG. Elles ne chargent ni police, image, bibliothèque ni service externe. Les placer dans le même dossier pour conserver leurs liens. Le lien de démonstration depuis la connexion ouvre le dashboard personnel `dashboard.html`. Chaque société donne ensuite accès à sa fiche dans `index.html`.

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

Les données initiales de THIRTY reprennent la nouvelle capture : Amélien Delahaie, compte n° 1, 249 titres (24,90 %) ; Steve Rodgers, compte n° 2, 751 titres (75,10 %) ; 1 000 actions ordinaires de 1 € de valeur nominale. Ces données remplacent la répartition illustrative antérieure sur les écrans et les exports.

Fonctions disponibles dans la maquette : recherche par nom ou compte, tri du tableau, export CSV de la liste complète et de la table de capitalisation, consultation et modification des fiches, ajout d’un associé, modification du nombre total de titres et de la valeur nominale, recherche et détail du type de titres. Les exports complets ne dépendent pas du filtre affiché. Le capital et les parts sont calculés à partir des mêmes données, conservées par société dans `rg-demo-companies` (champ `ownership`).

Un associé peut être créé avec 0 titre. L’attribution ne peut pas dépasser les titres disponibles ; le total émis ne peut pas descendre sous les titres déjà attribués. Le reliquat apparaît comme « Titres non attribués ». La page société reprend automatiquement la répartition et les chiffres modifiés. Les nouvelles sociétés ne reçoivent pas les associés de THIRTY.

Ces opérations modifient uniquement les données locales du prototype. Elles n’émettent aucun titre juridiquement et n’enregistrent aucun mouvement auprès d’un organisme. Le registre des mouvements de titres reprend désormais les quatre lignes de l’extrait fourni. Les nouveaux projets restent des brouillons et ne modifient pas les soldes de l’actionnariat.


### Navigation, abonnement et mise à jour des informations

Les trois registres (titres, décisions, personnel) sont regroupés sous le menu déroulant « Registres ». « Mes formalités » donne accès aux formulaires de dépôt des comptes annuels et d’annonces légales, ainsi qu’au suivi des procédures. Les menus se ferment à la sélection, au clic extérieur ou avec Échap, et restent utilisables au clavier et sur mobile. La barre d’accès rapide a été retirée.

Le bloc abonnement utilise une carte avec bandeau vert forêt, informations de certifications, action d’ajout de certifications et liens de facturation/offres. Le solde historique demeure à confirmer.

La modale « Informations générales » propose « Saisie manuelle » et « Mise à jour automatique ». Cette dernière est une simulation locale : elle compare cinq champs publics à la fiche d’exemple THIRTY, permet de choisir les différences à préremplir, puis revient à la saisie pour relecture et enregistrement explicite. Elle préserve les champs non sélectionnés, les modifications manuelles et la clôture de l’exercice. Aucun appel INPI n’est effectué. Un autre SIREN sans fiche de démonstration conserve l’accès à la saisie manuelle.

Les trois modifications d’intitulés annulées par l’utilisateur n’ont pas été retenues : « VOTRE ESPACE JURIDIQUE », « Ma société » et « Toutes les informations de votre société, au même endroit. » sont conservés sur la vue société.


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

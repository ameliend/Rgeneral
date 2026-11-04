# Registre Général — charte et design system v1.0

La référence est l’interface forêt / ivoire déjà validée. Les nouveaux composants fixent des règles plus lisibles. Les modales des écrans existants les adoptent via une adaptation ciblée, sans remplacer la logique métier.

## Consulter

- [Charte graphique](charte-graphique.html) : identité, logos, palette, typographie, grille, iconographie, rédaction et accessibilité.
- [Charte PDF](charte-graphique.pdf) : document partageable, paginé et imprimable.
- [Design system interactif](design-system.html) : composants, états et exemples utilisables au clavier.
- [Tokens JSON](design-tokens.json) et [variables CSS](design-tokens.css).
- [Logos SVG](brand-assets/).

Servir le dossier avec `python3 -m http.server 3000 --bind 127.0.0.1`, puis ouvrir les deux HTML. Aucune installation, police distante ou ressource réseau n’est nécessaire. Le kit ZIP conserve les fichiers dans le même dossier et inclut la maquette pour que les liens d’exemple fonctionnent.

## Référence des composants

| Élément | Classe / contrat | Règle |
| --- | --- | --- |
| Action principale | `.rg-button.rg-button-primary` | Une action principale par zone de décision. |
| Autres actions | `.rg-button-secondary`, `.rg-button-quiet`, `.rg-button-danger` | Le rouge est réservé à la destruction, avec confirmation. |
| Tailles | `.rg-button-small`, standard, `.rg-button-large` | 36, 44 et 52 px minimum ; le compact est secondaire. |
| Bouton icône | `.rg-button-icon` | Nom accessible obligatoire, zone de 44 × 44 px. |
| Champ | `.rg-field` avec `label` et identifiant associé | Aide et erreur via `aria-describedby` ; erreur avec `aria-invalid`. |
| Statut | `.rg-badge` et variante sémantique | Couleur et texte ; « Certifié » uniquement sur preuve réelle. |
| Message | `.rg-alert` et variante sémantique | Une erreur persistante reste près du champ ou du contenu concerné. |
| Onglets | `.rg-tabs`, `tablist`, `tab`, `tabpanel` | Flèches, Début/Fin, sélection et focus cohérents. |
| Menu de liens | `.rg-details` avec `details/summary` | Un groupe de liens natifs ; fermeture Échap et clic extérieur. |
| Sous-navigation d’entités | `RGSubnav`, `.rg-subnav` | Aperçu, trois fiches et recherche de tous les associés dans une modale paginée. |
| Tableau | `.rg-table` dans `.rg-table-scroll` | En-têtes, tri annoncé et défilement interne sur mobile. |
| Carte | `.rg-card` | Une synthèse ou une entité ; bordure légère, surface blanche. |
| Abonnement | `.rg-subscription` | Bandeau forêt, usage chiffré seulement si confirmé. |
| Modale | `dialog.rg-dialog` | Titre, focus, Échap, Annuler et retour au déclencheur. |
| Notification | `.rg-toast` | `role=status`, fermeture disponible, aucun déplacement de focus. |
| Document | `.rg-paper` | Structure papier, cartouches et tableau à en-têtes groupés. |

## Intégration

Charger `design-tokens.css` avant `design-system.css`. Utiliser les variables `--rg-color-*`, `--rg-space-*`, `--rg-type-*`, `--rg-radius-*` et `--rg-size-*`. Les clés d’espacement reprennent la valeur en pixels, par exemple `--rg-space-24`.

Le catalogue et ses composants partagent `design-system.css`. Ce fichier contient aussi des règles globales pour le corps de page, les titres et les formulaires : revoir les interactions CSS avant de l’ajouter à une page historique, ou extraire la base utile dans la feuille de l’application. `design-system.js` anime uniquement les exemples ; les contrôleurs métier de l’application restent dans leurs fichiers existants.

Les SVG du logo gardent du texte éditable avec une pile Segoe UI / Arial. Pour une production imprimée définitive, choisir la police puis vectoriser le lettrage. Les deux mots s’écrivent toujours « Registre Général » avec leurs majuscules et leur accent.

## Faire évoluer la bibliothèque

1. Réutiliser un token ou un composant avant de créer une variante.
2. Ajouter l’état et son usage au catalogue, avec libellés, clavier et focus.
3. Modifier les valeurs dans le JSON et synchroniser le CSS ; vérifier leurs correspondances.
4. Vérifier textes longs, petits écrans, zoom, mouvements réduits et contrastes.
5. Mettre à jour la version, le PDF et le kit lors de la livraison.

Les ratios de contraste documentés sont des mesures sur les paires de couleurs fournies. Ils ne constituent pas un audit de conformité de l’application existante.

## Validation effectuée

Contrôle des liens et identifiants, correspondance tokens CSS/JSON, cinq largeurs de 320 à 1 440 px, copie de couleurs, onglets au clavier, fermeture du menu, validation et focus des formulaires, sélection de fichier, recherche et tri, modales et retour de focus, mouvements réduits et génération du PDF. Les démonstrations ne modifient ni les données métier ni le stockage local et n’effectuent aucun appel externe.


## Adoption actuelle : modales

`modals.css` adapte les dialogues existants aux tokens et aux composants de référence, sans charger le CSS global du catalogue. Les huit pages authentifiées et les cinq pages publiques chargent cette feuille après leurs styles propres. Les règles sont limitées à `#modal`, `#dialog` et `#privacy` : fond blanc explicite, schéma de couleur clair même sous un thème sombre, typographie et contrôles lisibles, focus, voile transparent et défilement des formulaires longs. Les dialogues restent reliés à un titre accessible ; les données et les parcours existants sont conservés.


## Sous-navigation d’entités

Le composant est documenté et manipulable dans `design-system.html#sous-navigation` avec vingt associés. Charger `collections.css` / `collections.js` avant `subnav.css` / `subnav.js` pour la liste paginée du sélecteur. Il utilise les mêmes `subnav.css` et `subnav.js` que l’application. `RGSubnav.render({id, overviewHref, items, activeId})` produit le HTML ; appeler `RGSubnav.hydrate()` après son insertion dans le DOM. Chaque item porte un identifiant, un libellé et un lien. Une seule entité est active (`aria-current="page"`). La barre ne rend que trois fiches maximum. « Tous les associés » ouvre une recherche sur la collection entière et affiche huit résultats par page. Les flèches et les touches gauche/droite/Début/Fin servent aux accès directs affichés. La modale possède son propre titre, se ferme avec Échap et rend le focus au déclencheur. Les observateurs sont libérés lors du remplacement d’une vue.

Les pages société n’ont plus de barre supérieure ; le nom de la société sert de titre principal. La navigation latérale conserve Mon espace, les sociétés, Notifications et Mon compte, avec ouverture dédiée sur mobile. Le header documentaire du design system est conservé.


## Pagination

`RGCollections.render({id,total,page,pageSize,sizes,label,controls})` fournit le HTML d’un composant borné. Les contrôleurs de chaque vue filtrent/trient toute la collection, puis rendent la page demandée. Le composant documente la plage visible, le total filtré et la page courante (`aria-current`). La recherche et le changement de tri/taille reviennent à la première page. Les boutons Précédent/Suivant sont désactivés aux extrémités ; les numéros sont limités à une fenêtre autour de la page courante avec première/dernière page.

La démonstration `design-system.html#pagination` utilise le même HTML/CSS que le dashboard. La pagination locale ne remplace pas une API paginée pour une application en production.


## Gestion des permissions

Le pattern est consultable dans `administration.html` : une qualité décrit le lien juridique, un rôle nommé porte une grille, et une personne référence un rôle. Les trois niveaux sont exclusifs par fonctionnalité ; l’écriture inclut la lecture. Les fonctions de décisions personnalisées ont un niveau Aucun accès par défaut.

Le formulaire large conserve sa surface blanche et ses commandes globales. Sur mobile, chaque fonctionnalité devient une carte avec trois choix lisibles. Les listes de personnes, la sélection multiple et les invitations sont recherchables et paginées ; les sélections sont conservées entre pages. Le rôle propriétaire est présenté comme protégé ; la suppression d’un rôle attribué exige un choix de remplacement.

Les statuts d’invitation distinguent explicitement l’exemple en attente, le brouillon préparé et l’annulation locale. Aucun état « envoyé » ou « accepté » n’est produit sans service réel. La maquette mémorise les règles sans prétendre appliquer une autorisation côté serveur.


## Parcours d’opération

Le pattern d’une opération comporte Saisie → Vérification → Fiche. Le récapitulatif affiche l’identité de la société, les personnes, les quantités et montants, les caractéristiques spécifiques, les documents et les effets prévus. Le retour préserve les saisies et fichiers ; la confirmation produit une fiche durable du projet de démonstration. Les nouveaux comptes sont créés à zéro titre à cette dernière étape seulement.

Les documents automatiques de cession portent leur statut exact : ordre de mouvement en brouillon non signé et fiche de préparation au CERFA non officielle. L’absence du formulaire fiscal vérifié n’est pas masquée par une imitation. Les traitements asynchrones d’un ancien formulaire ne doivent pas remplacer une nouvelle saisie après annulation.

## Renseignement du capital et navigation de revue

Le composant `capital-setup.js` / `capital-setup.css` utilise une modale blanche large, un indicateur de six étapes et des actions persistantes : registre antérieur, informations générales, catégories, associés, observation, récapitulatif. Sur mobile, les étapes forment une grille de trois colonnes. Les formulaires restent à une colonne et les tableaux défilent dans leur propre zone. La liste des associés est paginée à huit lignes ; la fiche d’édition ne s’ouvre que pour une personne à la fois. Les indicateurs de répartition affichent à la fois la quantité attribuée, la quantité attendue et le reste, avec un état complet lisible sans dépendre de la couleur.

L’enregistrement est réservé à la dernière étape ; les contrôles sont refaits sur toute la situation. Les observations et les informations facultatives se retrouvent au récapitulatif. Bons et titres composant le capital sont distingués. Les historiques n’acquièrent pas de nouveaux mouvements du seul fait d’une déclaration.

Le menu commun `design-switcher.js` / `design-switcher.css` est une navigation de revue, fixée en bas à droite avec liens réels, indication de la page courante, focus visible, fermeture Échap et marge dédiée en bas de page. Il relie le site, le design system et la charte graphique, sans contrôle de téléchargement. Les sources restent disponibles dans le dépôt. Le menu disparaît à l’impression et ne recouvre pas les modales natives.

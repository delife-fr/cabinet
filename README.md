# Cabinet

Application de gestion pour psychologue en libéral, pensée pour l'iPhone :
patients, planning des rendez-vous, notes de séance, paiements et impayés, charges du cabinet
(loyer, URSSAF, CIPAV…), tableau de bord et import des relevés bancaires.

## Confidentialité

- **Les données ne quittent jamais l'appareil.** Pas de compte, pas de serveur, pas de synchronisation.
  Ce dépôt ne contient que le code de l'application, aucune donnée.
- **Tout est chiffré** (AES-GCM 256) avant d'être enregistré dans le téléphone. La clé est protégée par le
  code choisi à l'installation et par une clé de secours. Sans l'un des deux, les données sont illisibles,
  y compris dans les sauvegardes.
- Verrouillage automatique, mode discret (initiales seulement à l'écran).
- Option **Ne plus demander le code** (Réglages → Sécurité) : Cabinet s'ouvre directement sur ce téléphone.
  Les données y restent chiffrées, avec une clé propre à l'appareil, mais leur protection devient celle du téléphone
  (Face ID ou code de l'iPhone). Les sauvegardes, elles, restent protégées par le code ou la clé de secours :
  le code est encore demandé pour restaurer. Réversible à tout moment (« Redemander le code à l'ouverture »).

## Installation sur iPhone

1. Ouvrir l'adresse de l'application dans **Safari**.
2. Bouton **Partager**, puis **Sur l'écran d'accueil**.
3. Ouvrir Cabinet depuis l'écran d'accueil, choisir un code et **noter la clé de secours sur papier**.

L'installation sur l'écran d'accueil est indispensable : Safari efface les données d'un site
non ouvert depuis 7 jours, mais pas celles d'une application ajoutée à l'écran d'accueil.

## Sauvegardes

Réglages → **Sauvegarder maintenant** produit un fichier chiffré, à ranger hors du téléphone
(ordinateur, clé USB…). Un rappel s'affiche régulièrement. Pour le relire : Réglages → **Restaurer**,
avec le code (ou la clé de secours) en vigueur au moment de la sauvegarde.

## Importer des patients (CSV)

Réglages → Données → **Importer des patients (CSV)**. Le fichier est lu dans le téléphone, rien n'est envoyé.

- L'export « Clients » de facture.net est reconnu tel quel ; pour un autre fichier, les colonnes sont
  reconnues par leur titre (prénom, nom, e-mail, téléphone, adresse, date de naissance…) et corrigeables à l'écran.
- Séparateur point-virgule, virgule ou tabulation ; fichier en UTF-8 ou Windows-1252.
- Statut au choix, ou d'après la date de dernière facture : moins de 3 mois → En suivi, sinon Suivi terminé.
- Les doublons (même nom, e-mail ou téléphone) sont écartés ; les lignes de sociétés sont ignorées sauf demande.
- Dates acceptées : `2026-10-09`, `09/10/2026`, `9.10.26`. Une année sur 2 chiffres au-delà de l'année en cours
  est lue en 19xx (naissance « 78 » → 1978).
- L'import s'annule juste après (bouton **Annuler**) ; plus tard, **Retirer les patients importés** enlève
  ceux qui n'ont ni rendez-vous ni note.

## Charges et catégories

- Finances → **Catégories** : ajouter, renommer, changer la couleur ou supprimer une catégorie de charges. Les charges
  suivent un renommage ; à la suppression, celles de la catégorie sont reportées dans la catégorie choisie
  (bouton **Annuler** juste après). Une catégorie se crée aussi depuis le formulaire d'une charge (« + Nouvelle catégorie… »).
- Chaque charge a son **mode de paiement**, comme une séance (carte, espèces, chèque, virement), plus le prélèvement.
  Il apparaît dans les listes.
- Carte **Dépenses par catégorie** : un anneau et sa légende pour le mois ou l'année. Au-delà de 6 catégories, les plus
  petites sont regroupées (« N autres catégories », détaillées dans la légende). Toucher une catégorie n'affiche plus
  que ses charges.

## Importer un relevé bancaire (CSV)

Finances → en bas, **Importer un relevé (CSV)** : le fichier des opérations téléchargé depuis l'espace Société Générale
(celui d'une autre banque convient en général). Il est lu dans le téléphone, rien n'est envoyé.

- Chaque opération s'affiche avec sa date, son libellé, son montant et son mode de paiement (carte, prélèvement,
  virement, chèque… déduit du libellé). On **coche** celles à importer et on **choisit la catégorie** de chaque dépense
  (ou « + Nouvelle catégorie… ») ; choisir une catégorie coche la ligne. Rien n'est coché d'avance.
- Les colonnes **Catégorie**, **Sous-catégorie** et **Pointée** de la banque ne sont pas reprises.
- Les dépenses deviennent des **charges** (le libellé complet de la banque va dans la note), les crédits des
  **autres recettes**. Un règlement de séance déjà encaissé dans Cabinet n'est pas à cocher : il compterait deux fois.
- Une dépense du montant d'une charge fixe de la même catégorie, pas encore saisie ce mois-là, compte pour elle.
- Les opérations déjà importées sont reconnues (même date, même montant, même libellé) : deux relevés qui se
  chevauchent ne créent pas de doublon. Un montant identique saisi à la main à 4 jours près est signalé (« Déjà saisie ? »).
- Colonnes reconnues par leur titre (date de l'opération, libellé, libellé complet, montant, ou débit et crédit),
  corrigeables dans « Correspondance des colonnes » ; ancien format Société Générale (ligne de compte en tête) reconnu ;
  séparateur point-virgule, virgule ou tabulation ; UTF-8 ou Windows-1252. Un fichier Excel est refusé : choisir le CSV.
- L'import s'annule juste après (bouton **Annuler**). Fiche fermée avant la fin : **Reprendre** retrouve les choix,
  jusqu'au verrouillage.

## Technique

Un seul fichier (`index.html`), sans bibliothèque externe. La politique de sécurité de la page (CSP)
n'autorise aucune connexion vers l'extérieur. `sw.js` permet l'utilisation hors ligne.

## Publier une nouvelle version

1. Changer le numéro de version aux quatre endroits : commentaire d'en-tête et `VERSION_APPLI` dans `index.html`,
   commentaire et nom du cache (`CACHE = 'cabinet-v…'`) dans `sw.js`. Le nouveau nom de cache fait recharger
   les icônes et le manifeste aux téléphones déjà installés.
2. **Recalculer les empreintes de la CSP** après toute modification d'un des deux `<script>` en ligne : la balise
   `Content-Security-Policy` liste l'empreinte SHA-256 (en base64) du contenu exact de chacun. Sans cela,
   la page reste blanche.
3. Vérifier que l'appli démarre, se verrouille et se rouvre, depuis un serveur local
   (`python3 -m http.server`, puis `http://localhost:8000`).
4. Après la fusion dans `main`, GitHub Pages met le site en ligne tout seul. Vérifier dans l'onglet **Actions**
   qu'un « pages build and deployment » a démarré pour le commit fusionné, puis, sur le téléphone, que le bas de
   Réglages affiche le nouveau numéro. S'il ne démarre pas (incident GitHub), le relancer :
   `gh api -X POST repos/delife-fr/cabinet/pages/builds`, ou Settings → Pages → Branch sur « None », enregistrer,
   puis remettre `main`. Ne pas relancer un ancien déploiement depuis Actions : il remettrait l'ancienne version.

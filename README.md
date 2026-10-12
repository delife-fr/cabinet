# Cabinet

Application de gestion pour psychologue en libéral, pensée pour l'iPhone :
patients, planning des rendez-vous, notes de séance, paiements et impayés, charges du cabinet
(loyer, URSSAF, CIPAV…), tableau de bord et exports pour le comptable.

## Confidentialité

- **Les données ne quittent jamais l'appareil.** Pas de compte, pas de serveur, pas de synchronisation.
  Ce dépôt ne contient que le code de l'application, aucune donnée.
- **Tout est chiffré** (AES-GCM 256) avant d'être enregistré dans le téléphone. La clé est protégée par le
  code choisi à l'installation et par une clé de secours. Sans l'un des deux, les données sont illisibles,
  y compris dans les sauvegardes.
- Verrouillage automatique, mode discret (initiales seulement à l'écran).

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

## Exports pour le comptable

Finances → livre des recettes et registre des dépenses de l'année, en CSV (point-virgule, UTF-8) qui s'ouvre
directement dans Excel. Un texte qui commence par `=`, `+`, `-` ou `@` est précédé d'une apostrophe pour ne pas
être pris pour une formule.

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

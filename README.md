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

## Technique

Un seul fichier (`index.html`), sans bibliothèque externe. La politique de sécurité de la page (CSP)
n'autorise aucune connexion vers l'extérieur. `sw.js` permet l'utilisation hors ligne.

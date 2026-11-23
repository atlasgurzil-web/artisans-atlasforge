# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Artisans indépendants, maîtres artisans, compagnons et PME du secteur du bâtiment et de l'artisanat français (couvreurs, zingueurs, plombiers-chauffagistes, électriciens, menuisiers, paysagistes). 

Ce sont des professionnels de terrain, exigeants sur la qualité d'exécution mais souvent déçus par les agences web généralistes ou les solutions d'annuaires coûteuses sans retour sur investissement tangible. Leur objectif prioritaire est de capter des chantiers qualifiés dans leur zone de chalandise locale, valoriser leurs labels de confiance (garantie décennale, QualiPAC, RGE, respect des DTU) et ne plus perdre d'appels ou de demandes de devis.

## Product Purpose

Atlas Forge est une agence et plateforme spécialisée dans la création de sites internet sur mesure pour les professionnels de l'artisanat et du bâtiment. Le site principal sert de vitrine d'autorité et de conversion commerciale pour présenter le modèle Atlas Forge, prouver l'expertise métier à travers 6 sites de démonstration interactifs intégrés en direct, et capter des leads d'artisans via un formulaire de demande d'étude avec dispatch automatisé par webhook n8n.

Le succès du produit se mesure par :
1. La conversion immédiate des visiteurs artisans en demandes de devis/contact.
2. L'appropriation immédiate par l'artisan de sa propre projection grâce aux mini-sites de démonstration fonctionnels.
3. La transmission instantanée et sécurisée des données de devis vers l'infrastructure d'automatisation n8n de l'agence.

## Positioning

Contrairement aux créateurs de sites généralistes (Wix, Squarespace) ou aux plateformes d'annuaires et d'intermédiation (qui revendent les mêmes leads à 5 artisans concurrents), Atlas Forge forge des actifs digitaux propriétaires et haut de gamme conçus spécifiquement pour chaque métier du bâtiment. Chaque site intègre la terminologie technique exacte, des calculateurs ou configurateurs interactifs par spécialité (ex: dimensionnement de pompe à chaleur, simulateur de profilés et coloris de gouttières zinc/alu, configuration d'aménagements paysagers ou bois), et une vitesse d'affichage instantanée pour les clients mobiles des artisans.

## Operating Context

- Consultation par des artisans souvent sur smartphone entre deux chantiers, ou le soir sur tablette/ordinateur lors des sessions administratives et devis.
- Environnement technique moderne : React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, intégration Webhook n8n configurable en direct.
- Routage direct par URL hash (`#/demo/<slug>`) permettant à l'agence d'envoyer des liens directs personnalisés à des prospects selon leur corps d'état.

## Capabilities and Constraints

- **6 Démonstrations Métiers Intégrées :** Toitures Martin (Couverture/Zinguerie), Aqua Confort (Plomberie/PAC RGE), Gouttières Pro (Gouttières aluminium sur mesure), Élec Habitat (Électricité/KNX/IRVE), Jardin Signature (Création paysagère & piscines), Atelier du Bois (Menuiserie d'art & agencement).
- **Visionneuse Interactive (DemoViewer) :** Sélecteur rapide des 6 métiers avec bascule de viewport Bureau vs Mobile (châssis iPhone 390px) et bouton d'action directe "Je veux un site similaire".
- **Formulaire de Qualification Commerciale & Webhook :** Capture structurée (nom, entreprise, email, téléphone, métier, zone, site existant, type de projet, budget, message) avec validation instantanée et envoi JSON sécurisé vers n8n avec tiroir de configuration technique (URL webhook personnalisée, test de connexion, payload d'exemple).
- **Module Devis par Métier :** Formulaire modulaire réutilisable avec calcul d'estimations adaptées aux spécificités techniques (rénovation, neuf, superficie, délais).

## Brand Commitments

- **Nom :** Atlas Forge.
- **Identité Visuelle & Matière :** Palette minérale et organique inspirée de l'atelier d'artisan — Terracotta `#C45525` (terre cuite, forge, brique), ivoire chaud `#F6F4EE` (chaux, pierre naturelle), brun charbon `#1F1B16` (fer forgé, ardoise).
- **Typographie :** Triple accord de caractères :
  - *Inter* pour la lisibilité et l'ergonomie de l'interface.
  - *Cormorant Garamond* pour l'élégance artisanale et le patrimoine d'ébénisterie/paysagisme.
  - *JetBrains Mono* pour les données chiffrées, la rigueur technique et les badges.
- **Micro-Interactions :** Retour haptique et tactile Emil Kowalski (`.pressable`, `cubic-bezier(0.16, 1, 0.3, 1)`).
- **Vocabulaire :** Rigueur absolue du lexique professionnel français (Décennale, DTU, RGE, zinguerie, domotique, débit, essence). Zéro jargon abstrait ou marketing creux.

## Evidence on Hand

- Code source complet de production dans `src/App.tsx` (3 500+ lignes).
- 6 mini-sites sectoriels opérationnels avec simulateurs interactifs :
  - Palette temps réel et rendu vectoriel SVG dynamique de profilé de gouttière zinc/alu dans Gouttières Pro.
  - Calculateur d'étanchéité et sélection d'ardoises naturelles dans Toitures Martin.
  - Formulaires d'estimation personnalisés par spécialité.
- Architecture d'intégration webhook n8n documentée et testable.

## Product Principles

1. **Exigence du Métier :** Le site web doit refléter la même rigueur de finition que le geste de l'artisan sur son chantier.
2. **Preuve par l'Exemple :** Ne jamais se contenter de promesses écrites ; chaque argument est démontré en direct par un site réel et interactif.
3. **Clarté & Réassurance Immédiate :** Mettre en avant ce qui rassure le client final (décennale, avis vérifiés, devis transparent, délais tenus).
4. **Zéro Friction de Contact :** Tout point de contact doit être actionnable en 1 clic (téléphone, rappel, demande de devis simple).
5. **Autonomie & Pérennité :** L'artisan est propriétaire de son outil et de ses données, sans abonnement captif d'intermédiaire.

## Accessibility & Inclusion

- Conformité WCAG 2.1 AA sur tous les ratios de contraste texte/fond (min. 4.5:1, principaux titres > 14:1).
- Navigation clavier fluide avec anneau `:focus-visible` contrasté terracotta.
- Cibles tactiles calibrées à un minimum de 44×44px pour un usage mobile sur chantier ou en déplacement.
- Balisage sémantique complet et attributs ARIA sur les éléments interactifs.

# Datepicker : Quickstart

## Prérequis
 * node/npm
 * bower


## Installation

```
git@github.com:voyages-sncf-technologies/datepicker.git
npm install
grunt
```

## Utiliser dans un projet

Avec bower, ajouter la ligne suivante dans le bower.json
```
"dependencies": {
  "datepicker": "https://github.com/voyages-sncf-technologies/datepicker.git#1.3.10"
 }
```

## Tâches Grunt

```
// Packager le projet
grunt build

// Lancer les tests unitaires
grunt test

// Faire un patch (incrément automatique du numéro de version + commit) et pusher sur github
grunt push:patch

// Faire une version mineure (incrément automatique du numéro de version + commit) et pusher sur github
grunt push:minor

// Faire une version majeure (incrément automatique du numéro de version + commit) et pusher sur github
grunt push:major
```

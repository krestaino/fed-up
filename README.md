# Fed Up!
A front-end boilerplate for scaffolding static projects.

## Features
* [Nunjucks](https://mozilla.github.io/nunjucks/) templating
* Inline SVG
* SCSS compile, autoprefix, minification, and source maps
* ES6/ES7 transpilation, minification, and source maps
* Hot-reload on file save

## Dependencies
[Node.js](https://nodejs.org/en/) 8 LTS

## Setup
```
$ git clone https://github.com/krestaino/fed-up.git
$ cd fed-up
$ npm install
```

## Development
```
$ npm start
```
* Runs ```gulp build```
* Launches Browsersync at [http://localhost:3000/](http://localhost:3000/)
* Watches  ```.njk```, ```.json```, ```.scss```, and ```.js``` files with hot-reloading.

## Production
```
$ gulp build --production
```
* Minifies ```.html```, ```.css```, ```.js```
* Skips creating source maps
* Replaces relative URLs with the `PRODUCTION_URL` environmental variable set in `.env`

## Build
```
$ npm run build
```
* Runs ```gulp clean```,```gulp nunjucks```,```gulp css```,```gulp js```, and ```gulp assets```

## Gulp Tasks
```
$ gulp nunjucks
```
* Compiles ```.njk``` files from ```src/html/pages/```
* Replaces ```<img src="*.svg">``` with inlined SVG 
* Languages are built from ```src/i18n/*.json``` files. By default, only ```en.json``` exists. Adding ```es.json``` will automatically build out Spanish pages to ```dist/es/```.

---
```
$ gulp scss
```
* SCSS compile
* Autoprefix
* Minify
* Source maps

---
```
$ gulp js
```
* ES6/ES7 transpilation
* Minify
* Source maps

---
```
$ gulp assets
```
* Moves ```src/assets/**/*``` to ```dist/assets/```

---
```
$ gulp clean
```
* Deletes all files and folders from ```dist/```

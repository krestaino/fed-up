# Fed Up!
A front-end boilerplate for quick project setup.
### Features
* [Nunjucks](https://mozilla.github.io/nunjucks/) templating, HTML minify
* Sass compile, autoprefix, minify, and source maps
* JS concatenate and minify
* Browsers are automatically updated as you change files
* Inlines SVG
* Production and development build tasks

## Dependencies
[Node.js](https://nodejs.org/en/) v4.5.0 or higher

## Setup
```
$ git clone https://github.com/krestaino/fed-up.git
$ cd fed-up
$ npm install
```

## Development
```
$ gulp dev
or
$ gulp
```
* Runs ```build```
* Launches Browsersync at [http://localhost:3000/](http://localhost:3000/)
* Watches  ```.njk```, ```.json```, ```.scss```, and ```.js``` files. Browsers are automatically updated as you change files.

## Build
```
$ gulp build
```
* Runs ```clean```,```nunjucks```,```css```,```js```,```assets```

## Build Production
```
$ gulp build --production
```
* Minifies ```.html```, ```.css```, ```.js```
* Skips creating source maps
* Replaces relative URLs with ```productionUrl``` (line 1 gulpfile.js)

## Gulp Tasks

```
$ gulp nunjucks
```
* Compiles ```.njk``` files from ```./src/pages/```
* Replaces ```<img src="*.svg">``` with inlined SVG 
* Languages are built from ```./src/data/*.json``` files. By default, only ```en.json``` exists. Adding ```es.json``` will automatically build out Spanish pages to ```./dist/es/```.

---
```
$ gulp css
```
* Sass compile
* Autoprefix
* Minify
* Source maps

---
```
$ gulp js
```
* Concatenate
* Minify
* Source maps

---
```
$ gulp assets
```
* Moves ```./src/assets/**/*``` to ```./dist/assets/```

---
```
$ gulp clean
```
* Deletes all files and folders from ```./dist/```
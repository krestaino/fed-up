# Fed Up!
A front-end boilerplate for quick project setup.
### Features
* [Nunjucks](https://mozilla.github.io/nunjucks/) templating
* Sass compile, autoprefix, and source maps
* JS concatenate
* Browsers reload on file save
* Inlines SVG
* Development and production build tasks

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
```
* Runs ```build```
* Launches Browsersync at [http://localhost:3000/](http://localhost:3000/)
* Watches  ```.njk```, ```.json```, ```.scss```, and ```.js``` files and reloads browsers on save

Note: ```gulp``` alone is shorthand for ```gulp dev```
## Build
```
$ gulp build
```
* Runs ```clean```,```nunjucks```,```css```,```js```, and ```assets```

## Production
```
$ gulp build --production
```
* Minifies ```.html```, ```.css```, ```.js```
* Skips creating source maps
* Replaces "```/assets/```" in ```.njk```,```.scss```, and ```.js``` files  with ```./.production-url``` file contents

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
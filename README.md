[![Dependency Status](https://david-dm.org/datatypevoid/vulgar.svg)](https://david-dm.org/datatypevoid/vulgar) [![volkswagen status](https://auchenberg.github.io/volkswagen/volkswargen_ci.svg?v=1)](https://travis-ci.org/datatypevoid/vulgar) [![GitHub tag](https://img.shields.io/github/tag/datatypevoid/vulgar.svg?maxAge=2592000)](https://github.com/datatypevoid/vulgar) [![StackShare](http://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](http://stackshare.io/datatypevoid/vulgar-stack) [![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide) [![Maintenance](https://img.shields.io/maintenance/yes/2016.svg)](https://github.com/datatypevoid/vulgar/commits/development) [![license](https://img.shields.io/github/license/datatypevoid/vulgar.svg)](https://github.com/datatypevoid/vulgar/blob/master/LICENSE)

[![MEAN with NG2 and Webpack](https://cloud.githubusercontent.com/assets/10481547/13732046/5ba42ab0-e94f-11e5-9962-ab04cbd6779f.png)](http://www.davidniciforovic.com)

v#!g@r [![Join Slack](https://img.shields.io/badge/slack-join-brightgreen.svg)](http://www.davidniciforovic.com/wp-login.php?action=slack-invitation) [![Join the chat at https://gitter.im/datatypevoid/vulgar](https://badges.gitter.im/datatypevoid/vulgar.svg)](https://gitter.im/datatypevoid/vulgar?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Twitter URL](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/datatype_void)
=============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

MEAN Stack Development Starter
------------------------------

> A MEAN stack development kit featuring [Angular 2](https://angular.io) ([Router](https://angular.io/docs/js/latest/api/router/), [Forms](https://angular.io/docs/js/latest/api/forms/), [Http](https://angular.io/docs/js/latest/api/http/), [Services](https://github.com/datatypevoid/vulgar/blob/development/src/client/app/+todo/todo.service.ts), [Tests](https://angular.io/docs/js/latest/api/test/), [E2E](https://angular.github.io/protractor/#/faq#what-s-the-difference-between-karma-and-protractor-when-do-i-use-which-)), [Express](http://expressjs.com/), [MongoDB](https://www.mongodb.org/) (complete with [Mongoose](https://www.mongoosejs.org/)), [Node](https://www.nodejs.org/), [Redux](https://egghead.io/series/getting-started-with-redux), [@ngrx/store](https://github.com/ngrx/store) [PassportJS](https://www.passportjs.org/), [Socket.IO](https://www.socket.io/), [Karma](https://karma-runner.github.io/), [Protractor](https://angular.github.io/protractor/), [Jasmine](https://github.com/jasmine/jasmine), [Istanbul](https://github.com/gotwarlost/istanbul), [Configuration](#configuration), [TypeScript](http://www.typescriptlang.org/), [@types](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=3&cad=rja&uact=8&ved=0ahUKEwjgjdrR7u_NAhUQ7GMKHXgpC4EQFggnMAI&url=https%3A%2F%2Fwww.npmjs.com%2F~types&usg=AFQjCNG2PFhwEo88JKo12mrw_4d0w1oNiA&sig2=N69zbO0yN8ET7v4KVCUOKA), [Sass](https://sass-lang.com), [Docco](https://jashkenas.github.io/docco/), [TsLint](http://palantir.github.io/tslint/), [Codelyzer](https://github.com/mgechev/codelyzer), [Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement-with-webpack.html), and [Webpack](http://webpack.github.io/) by [datatype_void](https://twitter.com/datatype_void).
>
> Walk through a complete tutorial that shows you how to build a simple todo app using this framework, check out [Building A Single Page Todo App with MEAN--Including Angular 2](http://www.davidniciforovic.com/2016/02/03/building-a-single-page-todo-app-with-mean-including-angular-2/)
>
> If you're looking to learn about Webpack and ES6 Build Tools check out [ES6-build-tools](https://github.com/AngularClass/ES6-build-tools)
>
> If you're looking to learn TypeScript see [TypeStrong/learn-typescript](https://github.com/TypeStrong/learn-typescript)
>
> If you're looking to learn how to move your Angular 1.x directives over to Angular 2 see [Migrating Directives to Angular 2](http://angular-tips.com/blog/2015/09/migrating-directives-to-angular-2/)
>
> And always keep the [Angular 2 docs](https://angular.io/docs/ts/latest/) at hand, because the times are always changing

This seed repo serves as an MEAN starter for anyone looking to get a full stack single-page application up and running with `Angular 2`, `MongoDB`, `ExpressJS`, `Node`, `Socket.io` using `TypeScript` across the stack. [Webpack](http://webpack.github.io/) is used for automating our build process and assisting with boilerplate. We're also using Protractor for our end-to-end story and Karma for our unit tests.

-	Best practices in file and application organization for `Angular 2`.
-	Ready-to-go full stack build system using `Webpack` for working with `TypeScript`.
-	Hot module reloading for the front-end à la `Webpack`.
-	Full-stack examples that are ready to go when experimenting with `Angular 2`.
-	A great MEAN seed repo for anyone who wants to start their project.
-	Testing `Angular 2` code with `Jasmine` and `Karma`.
-	Coverage with `Istanbul` and `Karma`
-	End-to-end `Angular 2` code using `Protractor`.
-	Type management with `@types`
-	`Sass` preprocessor linting and compiling
-	Documentation generation across the stack using `Docco`/`TypeDoc`

The rest of the stack features:

-	[Express](https://www.expressjs.com/) for creating robust `API`s,
-	[Socket.io](https://www.socket.io/) for real time event-based communication.
-	[Nodemailer](https://www.nodemailer.com/) for real time event-based communication.
-	[Mongoose](https://www.mongoosejs.com/) for email notifications
-	[MongoDB](https://www.mongodb.org) objects within the
-	[NodeJS](https://nodejs.org) environment.

Quick start
-----------

**Make sure you have Node version >= 5.0 and NPM >= 3**

### If you are located in China, use `cnpm`

#### https://github.com/cnpm/cnpm

> Install the stack then edit `app.ts` inside [`/src/app/app.ts`](/src/app/app.ts)

```bash
# install vulgar-cli and the generator it hooks into
$ npm install -g vulgar-cli generator-vulgar

# initialize installer
$ vulgar init <nameOfApplication>

# change directory to new application root
$ cd <nameOfApplication>

# add required global libraries
$ npm install -g gulp-cli webpack webpack-dev-server concurrently rimraf mocha typescript protractor karma

# install the repo with npm
# required only if you declined automated dependency installation
# during installation
$ npm install

# build code
$ npm run build

# start up the stack

# fire up MongoDB in a separate terminal
# alternatively, consider a hosted solution such as https://modulus.io or https://mlab.com
$ mongod

# this command runs two commands in parallel via `concurrently`:
# `npm run server` starts up `webpack-dev-server` allowing for
# hot module reloading
# `npm` run watch` uses `webpack` to watch the necessary files
# and build on file change
$ npm start

# in a separate terminal:
# start `Express` server
# this command is responsible for:
# bundling/transpiling code when change is detected with `webpack`
# restarting the server on change with `nodemon`
$ gulp serve
```

go to http://0.0.0.0:8080 or http://localhost:8080 in your browser

Table of Contents
=================

-	[File Structure](#file-structure)
-	[Getting Started](#getting-started)

	-	[Dependencies](#dependencies)
	-	[Installing](#installing)
	-	[Running the app](#running-the-app)

-	[Contributing](#contributing)

-	[TypeScript](#typescript)

-	[@Types](#types)

-	[Frequently asked questions](#frequently-asked-questions)

-	[Support, Questions, or Feedback](#support-questions-or-feedback)

-	[License](#license)

File Structure
--------------

We use a modular component approach in our starter. This is the new standard for developing not only Angular apps, but modular components across the stack--and a great way to ensure maintainable code by encapsulation of our behavior logic. A component is basically a self contained app usually in a single file or a folder with each concern as a file: style, template, specs, e2e, and component class. Here's how it looks:

```
vulgar
.
├── .atom-build.json                       * Build your current project,
│                                            directly from the Atom code editor
├── .babelrc                               * Configure Babel plugins and ES6/ES7
│                                            presets
├── .editorconfig                          * Defines coding styles to be read by
│                                            enabled editors
├── .gitignore                             * File and directory patterns for git
│                                            to intentionally not track
├── .nvmrc                                 * NVM Node version management
├── .travis.yml                            * Travis CI build environment config
├── Dockerfile                             * Contains all commands a user could
│                                            call on the CLI to assemble an
│                                            image
├── config                                 * Project config files
│   ├── config.example.json                * Example config.json file
│   ├── config.json                        * Untracked by git by default.
│   │                                        Required for stack to fire up.
│   ├── emailer.conf.ts                    * Nodemailer transport and config setup
│   ├── env.conf.ts                        * Development environment config
│   ├── gulpfile.conf.js                   * Gulp config and task definitions
│   ├── head.conf.js                       * Configuration for head elements
│   │                                        added during the creation of
│   │                                        index.html
│   ├── karma.conf.js                      * Karma environment config for unit  
│   │                                        testing
│   ├── modules                            * Configuration modules
│   │   └── . . .
│   ├── mongoose.conf.ts                   * Mongoose connection config
│   ├── passport.conf.ts                   * PassportJS config for managing user
│   │                                        authentication
│   ├── protractor.conf.js                 * Protractor config for E2E testing
│   ├── spec-bundle.js                     * Angular 2 test environment setup
│   ├── utils
│   │   └── helpers.js                     * Helper utilities that assist with
│   │                                        the bundling process
│   └── webpack
│       ├── client.common.js               * Common Webpack config for client
│       ├── client.dev.js                  * Development Webpack config for
│       │                                    client
│       ├── client.prod.js                 * Production Webpack config for
│       │                                    client
│       ├── client.test.js                 * Testing Webpack config for client
│       ├── server.common.js               * Common Webpack config for server
│       ├── server.dev.js                  * Development Webpack config for
│       │                                    server
│       ├── server.prod.js                 * Production Webpack config for
│       │                                    server
│       └── server.test.js                 * Testing Webpack config for server
├── gulpfile.js                            * Points to config/gulpfile.conf.js
├── karma.conf.js                          * Points to config/karma.conf.js
├── package.json                           * NPM dependency management
├── protractor.conf.js                     * Points to config/protractor.conf.js
├── src                                    * Project source files to be compiled
│   │                                      to JavaScript
│   ├── client                             * Source files for client web app
│   │   ├── app                            * Client app source files
│   │   │   ├── +todo                      * Asynchronous Todo module
│   │   │   │   └── . . .
│   │   │   ├── admin                      * Admin module
│   │   │   │   └── . . .
│   │   │   ├── app.component.e2e.ts       * E2E test file for top-level app
│   │   │   │                                component
│   │   │   ├── app.component.spec.ts      * Unit test file for top-level app
│   │   │   │                                component
│   │   │   ├── app.component.ts           * Top-level app component
│   │   │   ├── app.module.ts              * Module definition for Angular app
│   │   │   ├── app.resolver.ts            * Helper for resolving routes with
│   │   │   │                                data
│   │   │   ├── app.routes.ts              * App module route definitions
│   │   │   ├── app.service.ts             * Service for managing immutable
│   │   │   │                                app state
│   │   │   ├── auth-connection.backend.ts * Intercepts certain auth errors
│   │   │   ├── environment.ts             * Front-end environment config
│   │   │   ├── home                       * Home module
│   │   │   │   └── . . .
│   │   │   ├── login                      * Login module
│   │   │   │   └── . . .
│   │   │   ├── no-content                 * 404: no content module
│   │   │   │   └── . . .
│   │   │   ├── register                   * registration module
│   │   │   │   └── . . .
│   │   │   └── shared                     * Shared directives, services,
│   │   │       │                            interfaces, et cetera
│   │   │       ├── client-socket.ts       * Base class for socket functionality
│   │   │       ├── directives             * Shared Angular directives
│   │   │       │   └── . . .
│   │   │       ├── interfaces             * Shared TypeScript interfaces
│   │   │       │   └── . . .
│   │   │       └── services               * Shared Angular services
│   │   │           └── . . .
│   │   ├── assets                         * Static assets are served here
│   │   │   ├── icon                       * Icons generated with
│   │   │   │   │                            www.favicon-generator.org
│   │   │   │   └── . . .
│   │   │   ├── img                        * Front-end image assets
│   │   │   │   └── . . .
│   │   │   └── service-worker.js          * Web app service worker that's not
│   │   │                                    complete yet
│   │   ├── custom-typings.d.ts            * Custom type definitions for 3rd
│   │   │                                    party modules go here
│   │   ├── index.html                     * Index.html: where we generate our
│   │   │                                    index page
│   │   ├── main.browser.ts                * Entry file for the browser
│   │   │                                    environment
│   │   ├── meta
│   │   │   ├── humans.txt                 * For fellow humans to know who the
│   │   │   │                                developers are
│   │   │   └── robots.txt                 * For search engines to crawl your
│   │   │                                    website
│   │   ├── polyfills.browser.ts           * Polyfill files go here
│   │   ├── sass                           * Sass stylesheets( follows 7-in-1
│	  │   │                                    architecture )
│   │   │   └── . . .
│   │   └── vendor.browser.ts              * For vendor imports ( e.g. JQuery,
│	  │                                        lodash, etc. )
│   └── server                             * Source files for Node app
│       ├── app.ts                         * Server bootstrap and configuration
│       ├── handlers                       * Common error and event handlers
│       │   └── . . .
│       ├── models                         * MongoDB models
│       │   └── . . .
│       ├── routes                         * Route definitions for server API
│       │   ├── _authentication.router.ts  * User auth routes
│       │   ├── . . .
│       │   └── router.ts                  * Base router class
│       ├── routes.ts                      * Import routers and confiure  API
│       ├── server.conf.ts                 * Fire up server app
│       ├── sockets                        * Houses Socket.io functionality
│       │   └── base.socket.ts             * Base socket class
│       └── utils                          * Server utility functions
│           ├── normalize-port.util.ts     * Port normalization utility
│           └── on-error.util.js           * Error utility
├── test/                                  * Server unit tests
│   ├── mocha.opts                         * Mocha config options
│   ├── . . .
│   └── utils.js                           * Server unit testing utilities
├── tsconfig.json                          * TypeScript config for Webpack
├── tslint.json                            * TypeScript lint config
├── typedoc.json                           * TypeScript doc generator config
├── vulgar.json                            * Ignore. Unused for now
└── yarn.lock                              * Yarn dependency management

```

Getting Started
===============

Prerequisite Technologies
-------------------------

### What you need to run this app:

### Linux

-	*Node.js* - [Download](http://nodejs.org/download/) and Install Node.js, nodeschool has free [node tutorials](http://nodeschool.io/#workshoppers) to get you started.
-	*MongoDB* - [Download](https://www.mongodb.org/downloads) and Install MongoDB - [Check out their manual](https://docs.mongodb.org/manual/) if you're just starting.

If you're using `ubuntu`, this is the preferred repository to use...

```bash
$ curl -sL https://deb.nodesource.com/setup | sudo bash -
$ sudo apt-get update
$ sudo apt-get install nodejs
```

> If you have `nvm` installed, which is highly recommended (`brew install nvm`) you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file)

### Windows

-	*Node.js* - [Download](http://nodejs.org/download/) and Install Node.js, nodeschool has free [node tutorials](http://nodeschool.io/#workshoppers) to get you started.
-	*MongoDB* - Follow the great tutorial from the mongodb site - ["Install Mongodb On Windows"](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/)
-	*Git* - The easiest way to install git and then run the rest of the commands through the *git bash* application (via command prompt) is by downloading and installing [Git for Windows](http://git-scm.com/download/win)

### OS X

-	*Node.js* - [Download](http://nodejs.org/download/) and Install Node.js or use the packages within brew or macports.
-	*MongoDB* - Follow the tutorial here - [Install mongodb on OSX](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)
-	*git* - Get git [from here](http://git-scm.com/download/mac).

> `nvm` also works on OS X, which again is highly recommended (`brew install nvm`). With it you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file)

### *Ensure you are running the latest versions Node `v4.x.x`+ and NPM `3.x.x`\+*

Dependencies
------------

Once you have those, you should install these global dependencies with `npm install --global`:

-	`concurrently` (`$ npm install --global concurrently`\)
-	`generator-vulgar` (`$ npm install --global generator-vulgar`\)
-	`gulp-cli` (`$ npm install --global gulp-cli`\)
-	`karma` (`$ npm install --global karma-cli`\)
-	`mocha` (`$ npm install --global mocha`\)
-	`protractor` (`$ npm install --global protractor`\)
-	`typescript` (`$ npm install --global typescript`\)
-	`webpack-dev-server` (`$ npm install --global webpack-dev-server`\)
-	`webpack` (`$ npm install --global webpack`\)
-	`vulgar-cli` (`$ npm install --global vulgar-cli`\)

Installing
----------

-	`$ vulgar init` to install a new instance of the vulgar seed
-	`$ npm install` to install all local dependencies, or `$ yarn`

> `Yarn` is a fast, reliable and more secure JavaScript package manager. It utilizes the same `package.json` file as `npm`, but offers a better workflow overall than `npm.` Learn more at https://yarnpkg.com/

-	`$ mongod` in a separate terminal, to fire up MongoDB
-	`$ npm run build` to build necessary front-end code with Webpack
-	`$ npm start` to enable hot module reloading and build on file change
-	In a new terminal, `gulp serve` to transpile, bundle, and serve our backend on file change

config.json
-----------

The `server.conf.js` file is expecting certain `environment` `variables` to be set within `Node`. The `env.conf.js` has functions to check whether the expected `environment` `variables` have been setup before proceeding to start up the rest of the server. It uses a file called `config.json` stored in the `config` directory that looks something like this:

```
{
  # Node environment
  "ENV" : "development",
  # MAKE SURE PORT IS NOT 8080 OR WHATEVER THE WEBPACK
  # DEV SERVER PORT IS SET TO
  "PORT" : 3000,
  # Socket.io Port
  "SOCKET_PORT" : 3001,
  "MONGO_URI" : {
    "DEVELOPMENT" : "mongodb://[username:password]@host[:port]",
    "PRODUCTION" : "mongodb://[username:password]@host[:port]",
    "TEST" : "mongodb://[username:password]@host[:port]"
  },
  # Generate your own 256-bit WEP key here:
  # http://randomkeygen.com/
  # Note that you don't need to use specifically
  # this, but it will certainly suffice
  "SESSION_SECRET" : "355FC4FE9348639B4E4FED1B8E93C",
  # Settings for the email sender
  # The TRANSPORT key is passed straight into nodeMailer 
  # so it can be any supported transport
  # // https://nodemailer.com/smtp/ && https://nodemailer.com/transports/
  "EMAIL_SETTINGS": {
    "TRANSPORT": {
      "service": "Mailgun",
      "auth": {
        "user": "postmaster@mg.domainname.com",
        "pass": "d77c50a5eda3697988d61fb684c36593"
      },
      "tls":{
        "rejectUnauthorized": false
      }
    }
    # Email settings can be used to hold settings for different email configs
    # Check emailer.conf.ts for an example
    "REGISTER": {
      "from": "accounts@domainname.com",
      "subject": "Account Created",
      "template": "register",
      "context": {
        "website": "http://www.domainname.com"
      }
    } 
  }
}

You should definitely change your `SESSION_SECRET` for even the most lackadaisical development effort.
```

### A Quick Note About the `config.json` Object

This object is not absolutely required. You can pass these values in however you want, whether it is through the command line or some alternative method. This just provided me with an easy way of storing a couple of values that do not change often.

Running the app
---------------

After you have installed all dependencies and modified your `config.json` file, you can now run the app. First, you must start up the back-end server in a separate terminal using the `gulp serve` command. This will transpile our server `TypeScript` code, bundle it, and recompile on any changes. This is all courtesy of `webpack`. In addition, `nodemon` is utilized to restart the server whenever file changes are detected. Next use the `npm start` command in the original terminal which runs two `npm` scripts in parallel: `npm run server` to start `webpack-dev-server` for building our front-end in the computer's memory, enabling hot module reloading; `npm run watch` to watch all of the front-end files and build them upon changes. You can now fire up your favorite web browser and visit the running application at `localhost:8080`!

### A Quick Note About `webpack-dev-server`

If you were paying attention you may have noticed that we set our `PORT` constant to `3000` in our `config.json` object, yet we connect to `8080` in the browser. This is because requests must be proxied between the client and server when using `webpack-dev-server`. If we run our server without `webpack-dev-server` for hot module reloading, we would connect to `localhost:3000` instead. This goes for `production` environments as well.

### server

```bash
# development
# package front-end files with Webpack and hot reload
# upon any changes
$ npm start
# use `Gulp` in a second terminal to run the Express
# app responsible for our back-end
$ gulp serve

# production
$ npm run build:prod
$ npm run server:prod
```

Other commands
--------------

##Server
  ### transpile/bundle/recompile server code with `webpack`

  ### restart server on file change
  
  ```bash
  $ gulp serve
  ```
  
  ### build server code with `webpack`
  
  ```bash
  $ gulp build:server
  ```
  
  ### build server code and restart node server on change
  
  ```bash
  $ gulp watch:server
  ```
  
  ### build documentation
  
  ```bash
  $ gulp build:docs
  ```
  
  ### clean documentation
  
  ```bash
  $ gulp clean:docs
  ```
  
  ### lint sass
  
  ```bash
  $ gulp lint:sass
  ```
  
  ### watch and lint sass
  
  ```bash
  $ gulp watch:sass
  ```

##Client
  ### build files
  
  ```bash
  # development
  $ npm run build:dev
  # production
  $ npm run build:prod
  ```
  
  ### watch and build files
  
  ```bash
  $ npm run watch
  ```
  
  ### run tests
  
  ```bash
  $ npm run test
  ```
  
  ### watch and run our tests
  
  ```bash
  $ npm run watch:test
  ```
  
  ### run end-to-end tests
  
  ```bash
  # make sure you have your server running in another terminal
  $ npm run e2e
  ```
  
  ### run webdriver (for end-to-end)
  
  ```bash
  $ npm run webdriver:update
  $ npm run webdriver:start
  ```
  
  ### run Protractor's elementExplorer (for end-to-end)
  
  ```bash
  $ npm run webdriver:start
  # in another terminal
  $ npm run e2e:live
  ```

Configuration
=============

Configuration files live in `config/`. We are currently using `mongooose`, `passportJS`, `webpack`, `karma`, and `protractor` for different stages and parts of your full-stack application

Contributing
============

Contibutors are welcome. If you are interested in collaborating with us or contributing to this project, please join our chat on [Slack](http://www.davidniciforovic.com/wp-login.php?action=slack-invitation). You can also view our `Trello` board which is where the roadmap and task backlog live https://trello.com/b/Kk4qnt2T/vulgar

Read and Contribute to the Wiki
-------------------------------

Make sure you read the [Wiki](https://github.com/datatypevoid/vulgar/wiki).

TypeScript
==========

> To take full advantage of TypeScript with autocomplete you would have to install it globally and use an editor with the correct TypeScript plugins.

Use latest TypeScript compiler
------------------------------

TypeScript 2.0.x includes everything you need. Make sure to upgrade, even if you installed TypeScript previously.

```
$ npm install --global typescript
```

Use a TypeScript-aware editor
-----------------------------

We have good experience using these editors:

-	[Atom](https://atom.io/) with [TypeScript plugin](https://atom.io/packages/atom-typescript)
-	[Sublime Text](http://www.sublimetext.com/3) with [Typescript-Sublime-Plugin](https://github.com/Microsoft/Typescript-Sublime-plugin#installation)
-	[Visual Studio Code](https://code.visualstudio.com/)
-	[Webstorm 10](https://www.jetbrains.com/webstorm/download/)

Types
=====

> When you include a module that doesn't include Type Definitions inside of the module you can include external Type Definitions with @types

i.e, to have youtube api support, run this command in terminal:

```shell
npm i @types/youtube @types/gapi @types/gapi.youtube
```

In some cases where your code editor doesn't support Typescript 2 yet or these types weren't listed in `tsconfig.json`, add these to **"src/custom-typings.d.ts"** to make peace with the compile check:

```es6
import '@types/gapi.youtube';
import '@types/gapi';
import '@types/youtube';
```

Custom Type Definitions
-----------------------

When including 3rd party modules you also need to include the type definition for the module if they don't provide one within the module. You can try to install it with @types

```
$ npm install @types/node
$ npm install @types/lodash
```

If you can't find the type definition in the registry we can make an ambient definition in this file for now. For example

```typescript
declare module "my-module" {
  export function doesSomething(value: string): string;
}
```

If you're prototyping and you will fix the types later you can also declare it as type any

```typescript
declare var assert: any;
declare var _: any;
declare var $: any;
```

If you're importing a module that uses Node.js modules which are CommonJS you need to import as

```typescript
import * as _ from 'lodash';
```

Frequently asked questions
==========================

-	What's the current browser support for Angular 2?

	-	Please view the updated list of [browser support for Angular 2](https://github.com/angularclass/awesome-angular2#current-browser-support-for-angular-2)

-	Why is my service, aka provider, is not injecting parameter correctly?

	-	Please use `@Injectable()` for your service for typescript to correctly attach the metadata (this is a TypeScript problem)

-	How do I run protractor with node 0.12.x?

	-	please check out this repo to use the old version of protractor [#146](https://github.com/AngularClass/angular2-webpack-starter/pull/146/files)

-	Where do I write my tests?

	-	You can write your tests next to your component files. See [`/src/app/home/home.spec.ts`](/src/app/home/home.spec.ts)

-	How do I start the app when I get `EACCES` and `EADDRINUSE` errors?

	-	The `EADDRINUSE` error means one of the port configurations is currently being used and `EACCES` is lack of permission for webpack to build files to `./dist/`

-	How to use `sass` for css?

	-	`loaders: ['raw-loader','sass-loader']` and `@Component({ stylesUrls: [ './filename.scss' ] })` see issue [#136](https://github.com/AngularClass/angular2-webpack-starter/issues/136) from the [Angular 2 Webpack Starter Kit](https://github.com/AngularClass/angular2-webpack-starter)

-	How do I test a Service?

	-	See issue [#130](https://github.com/AngularClass/angular2-webpack-starter/issues/130#issuecomment-158872648)

-	How do I add `vscode-chrome-debug` support?

	-	The VS Code chrome debug extension support can be done via `launch.json` see issue [#144](https://github.com/AngularClass/angular2-webpack-starter/issues/144#issuecomment-164063790) from the [Angular 2 Webpack Starter Kit](https://github.com/AngularClass/angular2-webpack-starter)

-	How do I make the repo work in a virtual machine?

	-	You need to use `0.0.0.0` so revert these changes [#205](https://github.com/AngularClass/angular2-webpack-starter/pull/205/files) from the [Angular 2 Webpack Starter Kit](https://github.com/AngularClass/angular2-webpack-starter)

-	What are the naming conventions for Angular 2?

	-	please see issue [#185](https://github.com/AngularClass/angular2-webpack-starter/issues/185) and PR [196](https://github.com/AngularClass/angular2-webpack-starter/pull/196) from the [Angular 2 Webpack Starter Kit](https://github.com/AngularClass/angular2-webpack-starter)

-	How do I include bootstrap or jQuery?

	-	please see issue [#215](https://github.com/AngularClass/angular2-webpack-starter/issues/215) and [#214](https://github.com/AngularClass/angular2-webpack-starter/issues/214#event-511768416) from the [Angular 2 Webpack Starter Kit](https://github.com/AngularClass/angular2-webpack-starter)

-	How do I async load a component?

	-	{ path: '/about', loader: () => require('es6-promise!./about/about')('About') }
	-	Also see [es6-promise-loader](https://github.com/gdi2290/es6-promise-loader)

-	Error: Cannot find module 'tapable'

	-	Remove `node_modules/` and run `npm cache clean` then `npm install`

-	`RangeError: Maximum call stack size exceeded`

	-	This is a problem with minifying Angular 2 and it's recent JIT templates. If you set `mangle` to `false` then you should be good.

-	Why is the size of my app larger in development?

	-	We are using inline source-maps and hot module replacement which will increase the bundle size.

-	If you are located in China, use `cnpm`

	-	https://github.com/cnpm/cnpm

-	node-pre-gyp ERR in npm install (Windows)

	-	install `Python x86` version between `2.5` and `3.0` on Windows machines

-	`Error:Error: Parse tsconfig error [{"messageText":"Unknown compiler option 'lib'.","category":1,"code":5023},{"messageText":"Unknown compiler option 'strictNullChecks'.","category":1,"code":5023},{"messageText":"Unknown compiler option 'baseUrl'.","category":1,"code":5023},{"messageText":"Unknown compiler option 'paths'.","category":1,"code":5023},{"messageText":"Unknown compiler option 'types'.","category":1,"code":5023}]`

	-	remove `node_modules/typescript` and run `npm install typescript@beta`. This repo now uses ts 2.0

Acknowledgements
----------------

> [AngularClass](https://github.com/AngularClass) for their Angular 2 Webpack repo which served as a starting point for the front-end

Support, Questions, or Feedback
===============================

> Contact us anytime for anything about this repo, Angular 2, or MEAN stack development in general.

-	[Slack: vulgardisplayofpower.slack](http://www.davidniciforovic.com/wp-login.php?action=slack-invitation)
-	[Twitter: @datatype_void](https://twitter.com/datatype_void)
-	[Gitter: datatypevoid/vulgar](https://gitter.im/datatypevoid/vulgar?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

---

enjoy -- **Da5id**

<br><br>

> Looking for corporate Angular/MEAN training, want to host us, or Angular/MEAN consulting? david.r.niciforovic@gmail.com

License
=======

[MIT](/LICENSE)

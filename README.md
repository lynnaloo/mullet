# The Mullet Stack

[![forthebadge](http://forthebadge.com/images/badges/contains-cat-gifs.svg)](http://forthebadge.com)

<img src="https://cloud.githubusercontent.com/assets/1610195/5716009/cf500292-9ab1-11e4-84a2-f93f9766afa9.png" align="center" width="200">

[Facebook](http://facebook.github.io/react/) in the front. [Walmart](http://hapijs.com) in the back.

All sitting on top of [Node.js](http://nodejs.org/).

[![NPM version](https://badge.fury.io/js/mullet.svg)](http://badge.fury.io/js/mullet) [![Greenkeeper badge](https://badges.greenkeeper.io/lynnaloo/mullet.svg)](https://greenkeeper.io/) [![Build Status](https://dev.azure.com/lynnaloo/Mullet/_apis/build/status/lynnaloo.mullet?branchName=master)]([![Build Status](https://dev.azure.com/lynnaloo/Mullet/_apis/build/status/lynnaloo.mullet?branchName=master)](https://dev.azure.com/lynnaloo/Mullet/_build/latest?definitionId=18&branchName=master)![Azure Static Web Apps CI/CD](https://github.com/lynnaloo/mullet/workflows/Azure%20Static%20Web%20Apps%20CI/CD/badge.svg)

## Get the Party Started

Install [Node.js](http://nodejs.org/)

### Setup the Mullet stack for development:

```
git clone https://github.com/lynnaloo/mullet
cd mullet
npm install
npm run build
```

Start the Mullet Server:

```
npm start
```

Watch the client folders for changes during development:

````
npm watch
```

#### OR

### Install the Mullet module:

```
npm add mullet
```

Start the Mullet Server:

```
npm start mullet
```

## Party On!

Point your browser to `http://localhost:8000` to see the sample page!

## But Seriously

This setup is a decent starting place to play around with Node, Hapi, and React.

To get started, edit the sample React component: `src/components/Facebook.js`

## FAQ

### But what about server-side rendering?

I didn't want to pull this into the core, but you should definitely checkout [this approach](https://github.com/leftieFriele/mullet/tree/serverside) by [@leftieFriele](http://www.github.com/leftieFriele).

### What if I want to add Redux, Mobx, Gulp, Grunt, Mocha, etc. ?

Put in an [issue](https://github.com/lynnaloo/mullet/issues) and we'll discuss it! I decided not to include many 3rd party modules in the core project unless I felt like it was something that was recommended by React or HapiJS and didn't add too much to the complexity. No matter what I think, you should [fork this] and make your own version with everything you want to add!

### Are you using this in production?

Noooooo. This is a good starter kit and learning tool.

## Contributors

Mullet Stack was created on a Thursday night by [Linda Nichols](http://www.github.com/lynnaloo). Name inspiration by [Ryan Brunsvold](http://www.github.com/brunsvold) who probably wishes to not be credited on something called "The Mullet Stack."

Mullet Cat Logo design by [Lookmai Rattana](http://www.github.com/cosmicmeow).

[Weyland](http://www.github.com/weyj4) moved us on up from Gulp/Browserify to Webpack.

Special thanks to all of the people that have taken their time to submit [pull requests](https://github.com/lynnaloo/mullet/graphs/contributors) to make this project better!

## Contact

Twitter: [@lynnaloo](http://www.twitter.com/lynnaloo)

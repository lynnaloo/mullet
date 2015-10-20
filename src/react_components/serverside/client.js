var React = require('react');
var AppComponent = require('./facebook.jsx');


var App = React.createFactory(AppComponent);
var mountNode = document.getElementById('AppMount');
var serverState = window.state;

React.render(App(serverState), mountNode);

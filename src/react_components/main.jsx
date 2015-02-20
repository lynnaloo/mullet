/** @jsx React.DOM */

(function () {
  'use strict';

  var React   = require('react'),
    Facebook = React.createFactory(require('./facebook.jsx'));

  React.render(
    <Facebook />,
    document.getElementById('facebook')
  );

}());

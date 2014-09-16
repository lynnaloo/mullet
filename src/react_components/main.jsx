/** @jsx React.DOM */

(function () {
  'use strict';

  var React   = require('react'),
    Facebook = require('./facebook.jsx');

  React.renderComponent(
    <Facebook />,
    document.getElementById('facebook')
  );

}());

/** @jsx React.DOM */

(function () {
  'use strict';

  var React   = require('react'),
    Facebook = React.createFactory(require('./facebook.jsx'));

  React.render(
    <Facebook
      title="Welcome to the Mullet Stack."
      subtitle="Facebook in the front. Walmart in the back."/>,
    document.getElementById('facebook')
  );

}());

/** @jsx React.DOM */

(function () {
  'use strict';

  var React = require('react');

  var Facebook = React.createClass({
    getInitialState: function() {
      return {};
    },
    componentDidMount: function () {},
    componentWillUnmount: function() {},

    render: function() {
      return (
        <div className="container">
          <h1 className="page-header">Welcome to the Mullet Stack.</h1>
          <p className="lead">Facebook in the front. Walmart in the back.</p>

          <div className="footer">
            <p className="text-muted">Created by <a href="http://github.com/lynnaloo/">@lynnaloo</a></p>
          </div>
        </div>
      );
    }
  });

  module.exports = Facebook;

}());

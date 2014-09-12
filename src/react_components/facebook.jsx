/** @jsx React.DOM */

var React = require('react');

var Facebook = React.createClass({
  getInitialState: function() {
    return {};
  },
  componentDidMount: function() {},
  componentWillUnmount: function() {},

  render: function() {
    return (
      <div>
        <div class="container-fluid">
          <div class="page-header">
            <h1>Welcome to the Mullet Stack.</h1>
          </div>
          <p class="lead">Facebook in the front. Walmart in the back.</p>
        </div>

        <div class="footer">
          <div class="container">
            <p class="text-muted">Created by <a href="http://github.com/lynnaloo/">@lynnaloo</a></p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Facebook;

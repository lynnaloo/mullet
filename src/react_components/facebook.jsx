/** @jsx React.DOM */

(function () {
  'use strict';

  var React = require('react');

  var Facebook = React.createClass({
    propTypes: {
      title: React.PropTypes.string,
      subtitle: React.PropTypes.string
    },
    getInitialState: function () {
      return {};
    },
    componentDidMount: function () {},
    componentWillUnmount: function () {},

    render: function() {
      return (
        <div className="container">
          <header>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <img
                    className="img-responsive"
                    src="/images/mullet_600.png"
                    width="200"
                    alt="Mullet"/>
                  <p className="title">{this.props.title}</p>
                  <p className="subtitle">{this.props.subtitle}</p>
                  <p className="subtitle">
                    Created by <a href="http://github.com/lynnaloo/">@lynnaloo</a>
                  </p>
                </div>
              </div>
            </div>
          </header>
        </div>
      );
    }
  });

  module.exports = Facebook;

}());

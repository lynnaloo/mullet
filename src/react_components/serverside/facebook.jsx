'use strict';
var React = require('react');
var Layout = require('./layout/default.jsx');


var Styles = {
  flexContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  header: {
    textAlign: 'center'
  },
  image: {
    display: 'block',
    margin: '0 auto 20px'
  },
  title: {
    display: 'block',
    fontSize: '2em',
    fontWeight: 700
  },
  subtitle: {
    fontSize: '1em',
    fontWeight: 300
  }
};

var Facebook = React.createClass({
  render: function() {
    return (
      <Layout
      title="The Mullet Stack"
      >
      <div style={Styles.flexContainer}>
        <header style={Styles.header}>
          <img
            style={Styles.image}
            src="/images/mullet_600.png"
            width="200"
            alt="Mullet"/>
          <p style={Styles.title}>{this.props.title}</p>
          <p style={Styles.subtitle}>{this.props.subtitle}</p>
          <p style={Styles.subtitle}>
            Created by <a href="http://github.com/lynnaloo/">@lynnaloo</a>
          </p>
        </header>
      </div>
      </Layout>
    );
  }
});

module.exports = Facebook;

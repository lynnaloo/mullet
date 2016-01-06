import React, { Component } from 'react';

const Styles = {
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

export default class Facebook extends Component {

  render() {

    let backgroundColor = {
     color: this.props.color
    };

    return (
      <div style={Styles.flexContainer}>
        <header style={Styles.header}>
          <img
            style={Styles.image}
            src="/images/mullet_600.png"
            width="200"
            alt="Mullet"/>
          <p style={Styles.title}>{this.props.title}</p>
          <p style={Styles.subtitle}>{this.props.subtitle}</p>
          <div style={backgroundColor}>
            <button onClick={() => this.handleClick('red')}>Click Me to see Redux turn everything Red!</button>
            <button onClick={() => this.handleClick('blue')}>If you Click Me, Redux turns everything Blue.</button>
          </div>
          <p style={Styles.subtitle}>
            Created by <a href="http://github.com/lynnaloo/">@lynnaloo</a>
          </p>
        </header>
      </div>
    );
  }

  handleClick(color) {
    console.log('click');
    this.props.clickColor(color);
  } 

};

Facebook.propTypes = {
  subtitle: React.PropTypes.string,
  title: React.PropTypes.string,
  clickColor: React.PropTypes.func
};

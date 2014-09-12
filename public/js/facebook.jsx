/** @jsx React.DOM */

var Facebook = React.createClass({
  getInitialState: function() {
    return {secondsElapsed: 0};
  },
  tick: function() {
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div>
        <h1>Welcome to the Mullet Stack.</h1>
        <p>
          Facebook in the front. Walmart in the back.
        </p>
        <p>
          Party on!
        </p>
        <div>Seconds Elapsed: {this.state.secondsElapsed}</div>
      </div>
    );
  }
});

React.renderComponent(
  <Facebook />,
  document.getElementById('facebook')
);

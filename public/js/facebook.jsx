/** @jsx React.DOM */

var Facebook = React.createClass({
  render: function() {
    return (
      <p>
        Welcome to the Mullet Stack. Facebook in the front. Walmart in the back.
        Party on!
      </p>
    );
  }
});

React.renderComponent(
  <Facebook />,
  document.getElementById('facebook')
);

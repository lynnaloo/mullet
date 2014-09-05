/** @jsx React.DOM */

var Facebook = React.createClass({
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
      </div>
    );
  }
});

React.renderComponent(
  <Facebook />,
  document.getElementById('facebook')
);

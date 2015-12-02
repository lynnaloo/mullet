// __tests__/facebook.js

jest.dontMock('../src/react_components/facebook');

describe('test', function() {
  it('the widget actually renders', function() {
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;
    var Facebook = require('../src/react_components/facebook');
    var title = 'mullet';
    var subtitle = 'stuff';

    // Render a checkbox with label in the document
    var facebook = TestUtils.renderIntoDocument(
      <Facebook title={title} subtitle={subtitle}/>
    );

    // Verify that it's Off by default
    var titleField = TestUtils.findRenderedDOMComponentWithClass(facebook, 'title');
    expect(titleField.getDOMNode().textContent).toEqual(title);
  });
});

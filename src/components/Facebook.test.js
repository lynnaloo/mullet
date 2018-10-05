import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Facebook from './Facebook';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('test Facebook component', () => {
  const title = 'mullet';
  const subtitle = 'stuff';

  it('should render properly', () => {
    const facebook = shallow(<Facebook title={title} subtitle={subtitle} />);
    expect(facebook.exists());
  });

  it('test props', () => {
    const facebook = mount(<Facebook title={title} subtitle={subtitle} />);
    expect(facebook.props().title).toEqual('mullet');
    expect(facebook.props().subtitle).toEqual('stuff');
  });
});

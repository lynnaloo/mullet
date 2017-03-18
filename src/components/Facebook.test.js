import React from 'react';
import { shallow, mount } from 'enzyme';
import Facebook from './Facebook';

describe('test Facebook component', () => {
  const title = 'mullet';
  const subtitle = 'stuff';

  it('should render properly', () => {
    const facebook = shallow(<Facebook title={title} subtitle={subtitle} />);
    expect(facebook.exists());
  });

  it('test props', () => {
    const facebook = mount(<Facebook title={title} subtitle={subtitle} />);
    expect(facebook.prop('title')).toEqual('mullet');
    expect(facebook.prop('subtitle')).toEqual('stuff');
  });
});

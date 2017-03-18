import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Facebook from './Facebook';

describe('test Facebook component', () => {
  const title = 'mullet';
  const subtitle = 'stuff';

  it('should render correctly', () => {
    const facebook = shallow(<Facebook title={title} subtitle={subtitle} />);
    //expect(facebook.prop('title')).toEqual('mullet');
    //expect(facebook.prop('subtitle')).toEqual('stuff');

    //const testTitle = facebook.contains(<p style='mullet'>mullet</p>);
    //expect(testTitle).toBe(true);
  });

  // it('check subtitle', function() {
  //   expect(mount(<Facebook title={title} subtitle={subtitle}/>).find('title').text().toBe('mullet'));
  // });
});

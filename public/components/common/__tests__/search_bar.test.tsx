/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { renderDatePicker, SearchBar } from '..';
import * as sinon from 'sinon';

describe('Search bar components', () => {
  configure({ adapter: new Adapter() });

  it('renders date picker', () => {
    const setStartTime = jest.fn();
    const setEndTime = jest.fn();
    const wrap = mount(renderDatePicker('now-5m', setStartTime, 'now', setEndTime));
    expect(wrap).toMatchSnapshot();
  });

  it('renders search bar', () => {
    const clock = sinon.useFakeTimers();

    const refresh = jest.fn();
    const setQuery = jest.fn();
    const setStartTime = jest.fn();
    const setEndTime = jest.fn();
    const setFilters = jest.fn();
    const wrap = mount(
      <SearchBar
        refresh={refresh}
        page="dashboard"
        query="test"
        setQuery={setQuery}
        startTime="now-5m"
        setStartTime={setStartTime}
        endTime="now"
        setEndTime={setEndTime}
        filters={[]}
        setFilters={setFilters}
      />
    );
    expect(wrap).toMatchSnapshot();

    wrap
      .find('input[data-test-subj="search-bar-input-box"]')
      .simulate('change', { target: { value: 'queryTest' } });

    clock.tick(100);
    expect(setQuery).toBeCalledWith('queryTest');
  });
});

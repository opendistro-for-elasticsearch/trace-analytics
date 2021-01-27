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

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  getFilterFields,
  getInvertedOperator,
  getOperatorOptions,
  getType,
  getValidFilterFields,
  getValueComponent,
} from '../filter_helpers';

describe('Filter helper functions', () => {
  configure({ adapter: new Adapter() });

  it('returns fields by page', () => {
    const fields = getFilterFields('dashboard');
    expect(fields).toEqual(['traceGroup', 'status.code', 'status.message', 'durationInNanos']);
  });

  it('returns valid fields by page', () => {
    const dashboardFields = getValidFilterFields('dashboard');
    const servicesFields = getValidFilterFields('services');
    expect(dashboardFields).toEqual([
      'traceGroup',
      'status.code',
      'status.message',
      'durationInNanos',
      'Latency percentile within trace group',
    ]);
    expect(servicesFields).toEqual([]);
  });

  it('returns types by fields', () => {
    const durationType = getType('durationInNanos');
    expect(durationType).toEqual('long');
  });

  it('returns inverted operators', () => {
    const invertedBetween = getInvertedOperator('is between', true);
    const invertedExist = getInvertedOperator('exists', true);
    const invertedIs = getInvertedOperator('is', true);
    expect(invertedBetween).toEqual('is not between');
    expect(invertedExist).toEqual('does not exist');
    expect(invertedIs).toEqual('is not');
  });

  it('returns operator options by field', () => {
    const options = getOperatorOptions('durationInNanos');
    expect(options).toEqual([
      {
        label: 'is',
      },
      {
        label: 'is not',
      },
      {
        label: 'is between',
      },
      {
        label: 'is not between',
      },
      {
        label: 'exists',
      },
      {
        label: 'does not exist',
      },
    ]);
  });

  it('renders textfield filter', () => {
    const setValue = jest.fn((v) => {});
    const wrap = mount(getValueComponent('is', 0, setValue));
    expect(wrap).toMatchSnapshot();

    wrap.find('input').simulate('change', { target: { value: '100' } });
    expect(setValue).toBeCalledWith('100');
  });

  it('renders range field filter', () => {
    const setValue = jest.fn((v) => {});
    const wrap = mount(getValueComponent('is not between', { from: '0', to: '100' }, setValue));
    expect(wrap).toMatchSnapshot();

    wrap
      .find('input')
      .at(0)
      .simulate('change', { target: { value: '50' } });
    expect(setValue).toBeCalledWith({ from: '50', to: '100' });

    wrap
      .find('input')
      .at(1)
      .simulate('change', { target: { value: '200' } });
    expect(setValue).toBeCalledWith({ from: '0', to: '200' });
  });
});

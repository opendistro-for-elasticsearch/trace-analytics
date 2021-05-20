/*
 *   Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

import {
  EuiButtonIcon,
  EuiCopy,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiHorizontalRule,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { CoreStart } from '../../../../../src/core/public';
import { DATE_FORMAT } from '../../../common';
import { handleSpansFlyoutRequest } from '../../requests/traces_request_handler';
import { nanoToMilliSec } from '../common';
import { FlyoutListItem } from './flyout_list_item';

export function SpanDetailFlyout(props: {
  http: CoreStart['http'];
  spanId: string;
  isFlyoutVisible: boolean;
  closeFlyout: () => void;
  addSpanFilter: (field: string, value: any) => void;
}) {
  const [span, setSpan] = useState<any>({});

  useEffect(() => {
    handleSpansFlyoutRequest(props.http, props.spanId, setSpan);
  }, [props.spanId]);

  const getListItem = (field: string, title: React.ReactNode, description: React.ReactNode) => {
    return (
      <FlyoutListItem
        title={title}
        description={description}
        key={`list-item-${title}`}
        addSpanFilter={() => props.addSpanFilter(field, span[field])}
      />
    );
  };

  const renderContent = () => {
    if (!span || _.isEmpty(span)) return '-';
    const overviewList = [
      getListItem(
        'spanId',
        'Span ID',
        span.spanId ? (
          <EuiFlexGroup gutterSize="xs" style={{ marginTop: -4, marginBottom: -4 }}>
            <EuiFlexItem grow={false}>
              <EuiCopy textToCopy={span.spanId}>
                {(copy) => (
                  <EuiButtonIcon aria-label="copy-button" onClick={copy} iconType="copyClipboard" />
                )}
              </EuiCopy>
            </EuiFlexItem>
            <EuiFlexItem>{span.spanId}</EuiFlexItem>
          </EuiFlexGroup>
        ) : (
          '-'
        )
      ),
      getListItem(
        'parentSpanId',
        'Parent Span ID',
        span.parentSpanId ? (
          <EuiFlexGroup gutterSize="xs" style={{ marginTop: -4, marginBottom: -4 }}>
            <EuiFlexItem grow={false}>
              <EuiCopy textToCopy={span.parentSpanId}>
                {(copy) => (
                  <EuiButtonIcon aria-label="copy-button" onClick={copy} iconType="copyClipboard" />
                )}
              </EuiCopy>
            </EuiFlexItem>
            <EuiFlexItem>{span.parentSpanId}</EuiFlexItem>
          </EuiFlexGroup>
        ) : (
          '-'
        )
      ),
      getListItem('serviceName', 'Service', span.serviceName || '-'),
      getListItem('name', 'Operation', span.name || '-'),
      getListItem('durationInNanos', 'Duration', `${nanoToMilliSec(span.durationInNanos)} ms`),
      getListItem('startTime', 'Start time', moment(span.startTime).format(DATE_FORMAT)),
      getListItem('endTime', 'End time', moment(span.endTime).format(DATE_FORMAT)),
      getListItem('status.code', 'Has error', span['status.code'] === 2 ? 'Yes' : 'No'),
    ];
    const ignoredKeys = new Set([
      'spanId',
      'parentSpanId',
      'serviceName',
      'name',
      'durationInNanos',
      'startTime',
      'endTime',
      'status.code',
      'traceId',
      'traceGroup',
      'traceGroupFields.endTime',
      'traceGroupFields.statusCode',
      'traceGroupFields.durationInNanos',
    ]);
    const attributesList = Object.keys(span)
      .filter((key) => !ignoredKeys.has(key))
      .sort((keyA, keyB) => {
        const isANull = _.isEmpty(span[keyA]);
        const isBNull = _.isEmpty(span[keyB]);
        if ((isANull && isBNull) || (!isANull && !isBNull)) return keyA < keyB ? -1 : 1;
        if (isANull) return 1;
        return -1;
      })
      .map((key) => {
        if (_.isEmpty(span[key])) return getListItem(key, key, '-');
        let value = span[key];
        if (typeof value === 'object')
          value = JSON.stringify(value, null, 2).replace(/ /g, '\u00a0');
        return getListItem(key, key, value);
      });

    return (
      <>
        <EuiText size="m">
          <span className="panel-title">Overview</span>
        </EuiText>
        <EuiSpacer size="s" />
        {overviewList}
        <EuiSpacer size="xs" />
        <EuiHorizontalRule margin="s" />
        <EuiText size="m">
          <span className="panel-title">Span attributes</span>
          {attributesList.length === 0 || attributesList.length ? (
            <span className="panel-title-count">{` (${attributesList.length})`}</span>
          ) : null}
        </EuiText>
        <EuiSpacer size="s" />
        {attributesList}
      </>
    );
  };

  return (
    <>
      <EuiFlyout onClose={props.closeFlyout} size="s">
        <EuiFlyoutHeader hasBorder>
          <EuiTitle>
            <h2>Span Detail</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>{renderContent()}</EuiFlyoutBody>
      </EuiFlyout>
    </>
  );
}

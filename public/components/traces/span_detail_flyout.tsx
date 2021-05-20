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
}) {
  const [span, setSpan] = useState<any>({});
  useEffect(() => {
    handleSpansFlyoutRequest(props.http, props.spanId, setSpan);
  }, [props.spanId]);

  const getListItem = (title: React.ReactNode, description: React.ReactNode) => (
    <FlyoutListItem title={title} description={description} key={`list-item-${title}`} />
  );

  const renderContent = () => {
    if (!span || _.isEmpty(span)) return '-';
    const overviewList = [
      getListItem(
        'Span ID',
        span.spanId ? (
          <EuiFlexGroup
            gutterSize="xs"
            alignItems="center"
            style={{ marginTop: -4, marginBottom: -4 }}
          >
            <EuiFlexItem grow={false}>
              <EuiCopy textToCopy={span.spanId}>
                {(copy) => <EuiButtonIcon aria-label="copy-button" onClick={copy} iconType="copyClipboard" />}
              </EuiCopy>
            </EuiFlexItem>
            <EuiFlexItem>{span.spanId}</EuiFlexItem>
          </EuiFlexGroup>
        ) : (
          '-'
        )
      ),
      getListItem(
        'Parent Span ID',
        span.parentSpanId ? (
          <EuiFlexGroup
            gutterSize="xs"
            alignItems="center"
            style={{ marginTop: -4, marginBottom: -4 }}
          >
            <EuiFlexItem grow={false}>
              <EuiCopy textToCopy={span.parentSpanId}>
                {(copy) => <EuiButtonIcon aria-label="copy-button" onClick={copy} iconType="copyClipboard" />}
              </EuiCopy>
            </EuiFlexItem>
            <EuiFlexItem>{span.parentSpanId}</EuiFlexItem>
          </EuiFlexGroup>
        ) : (
          '-'
        )
      ),
      getListItem('Service', span.serviceName || '-'),
      getListItem('Operation', span.name || '-'),
      getListItem('Duration', `${nanoToMilliSec(span.durationInNanos)} ms`),
      getListItem('Start time', moment(span.startTime).format(DATE_FORMAT)),
      getListItem('End time', moment(span.endTime).format(DATE_FORMAT)),
      getListItem('Has error', span['status.code'] === 2 ? 'Yes' : 'No'),
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
      .map((key) => getListItem(key, _.isEmpty(span[key]) ? '-' : span[key]));
    return (
      <>
        <EuiText size="m">
          <span className="panel-title">Overview</span>
        </EuiText>
        <EuiSpacer size="xs" />
        {overviewList}
        <EuiSpacer size="xs" />
        <EuiHorizontalRule margin="s" />
        <EuiText size="m">
          <span className="panel-title">Span attributes</span>
          {attributesList.length === 0 || attributesList.length ? (
            <span className="panel-title-count">{` (${attributesList.length})`}</span>
          ) : null}
        </EuiText>
        <EuiSpacer size="xs" />
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

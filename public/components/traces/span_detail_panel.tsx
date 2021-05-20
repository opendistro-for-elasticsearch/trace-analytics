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
  EuiBadge,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiPanel,
  EuiSpacer,
} from '@elastic/eui';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { CoreStart } from '../../../../../src/core/public';
import { handleSpansGanttRequest } from '../../requests/traces_request_handler';
import { PanelTitle } from '../common';
import { Plt } from '../common/plots/plt';
import { SpanDetailFlyout } from './span_detail_flyout';

export function SpanDetailPanel(props: {
  http: CoreStart['http'];
  traceId: string;
  colorMap: any;
}) {
  const [data, setData] = useState({ gantt: [], table: [], ganttMaxX: 0 });
  const storedFilters = sessionStorage.getItem('TraceAnalyticsSpanFilters');
  const [spanFilters, setSpanFilters] = useState<Array<{ field: string; value: any }>>(
    storedFilters ? JSON.parse(storedFilters) : []
  );

  const setSpanFiltersWithStorage = (newFilters: Array<{ field: string; value: any }>) => {
    setSpanFilters(newFilters);
    sessionStorage.setItem('TraceAnalyticsSpanFilters', JSON.stringify(newFilters));
  };

  const addSpanFilter = (field: string, value: any) => {
    const newFilters = [...spanFilters];
    const index = newFilters.findIndex(({ field: filterField }) => field === filterField);
    if (index === -1) {
      newFilters.push({ field, value });
    } else {
      newFilters.splice(index, 1, { field, value });
    }
    setSpanFiltersWithStorage(newFilters);
  };

  const removeSpanFilter = (field: string) => {
    const newFilters = [...spanFilters];
    const index = newFilters.findIndex(({ field: filterField }) => field === filterField);
    if (index !== -1) {
      newFilters.splice(index, 1);
      setSpanFiltersWithStorage(newFilters);
    }
  };

  const spanFiltersToDSL = () => {
    const DSL: any = {
      query: {
        bool: {
          must: [],
          filter: [],
          should: [],
          must_not: [],
        },
      },
    };
    spanFilters.map(({ field, value }) => {
      if (value != null) {
        DSL.query.bool.must.push({
          term: {
            [field]: value,
          },
        });
      }
    });
    return DSL;
  };

  useEffect(() => {
    refresh();
  }, [props.colorMap, spanFilters]);

  const refresh = _.debounce(() => {
    if (_.isEmpty(props.colorMap)) return;
    const DSL = spanFiltersToDSL();
    handleSpansGanttRequest(props.traceId, props.http, setData, props.colorMap, DSL);
  }, 150);

  const getSpanDetailLayout = (plotTraces: Plotly.Data[], maxX: number): Partial<Plotly.Layout> => {
    // get unique labels from traces
    const yLabels = plotTraces
      .map((d) => d.y[0])
      .filter((label, i, self) => self.indexOf(label) === i);
    // remove uuid when displaying y-ticks
    const yTexts = yLabels.map((label) => label.substring(0, label.length - 36));

    return {
      height: 25 * plotTraces.length * (2 / 3) + 60,
      width: 800,
      margin: {
        l: 260,
        r: 5,
        b: 30,
        t: 30,
      },
      xaxis: {
        ticksuffix: ' ms',
        side: 'top',
        color: '#91989c',
        showline: true,
        range: [0, maxX * 1.2],
      },
      yaxis: {
        showgrid: false,
        tickvals: yLabels,
        ticktext: yTexts,
      },
    };
  };

  const layout = useMemo(() => getSpanDetailLayout(data.gantt, data.ganttMaxX), [
    data.gantt,
    data.ganttMaxX,
  ]);

  const [currentSpan, setCurrentSpan] = useState('');

  const onClick = (event) => {
    if (!event?.points) return;
    const point = event.points[0];
    setCurrentSpan(point.data.spanId);
  };

  const renderFilters = useMemo(() => {
    return spanFilters.map(({ field, value }) => (
      <EuiFlexItem grow={false} key={`span-filter-badge-${field}`}>
        <EuiBadge
          iconType="cross"
          iconSide="right"
          iconOnClick={() => removeSpanFilter(field)}
          iconOnClickAriaLabel="remove current filter"
        >
          {`${field}: ${value}`}
        </EuiBadge>
      </EuiFlexItem>
    ));
  }, [spanFilters]);

  const onHover = () => {
    const dragLayer = document.getElementsByClassName('nsewdrag')?.[0];
    dragLayer.style.cursor = 'pointer';
  };

  const onUnhover = (pr) => {
    const dragLayer = document.getElementsByClassName('nsewdrag')?.[0];
    dragLayer.style.cursor = '';
  };

  return (
    <>
      <EuiPanel>
        <PanelTitle title="Span detail" totalItems={data.gantt.length / 3} />
        {spanFilters.length > 0 && (
          <>
            <EuiSpacer size="s" />
            <EuiFlexGroup gutterSize="s" wrap>
              {renderFilters}
            </EuiFlexGroup>
          </>
        )}
        <EuiHorizontalRule margin="m" />
        <div style={{ overflowY: 'auto', maxHeight: 500 }}>
          <Plt
            data={data.gantt}
            layout={layout}
            onClickHandler={onClick}
            onHoverHandler={onHover}
            onUnhoverHandler={onUnhover}
          />
        </div>
      </EuiPanel>
      {!!currentSpan && (
        <SpanDetailFlyout
          http={props.http}
          spanId={currentSpan}
          isFlyoutVisible={!!currentSpan}
          closeFlyout={() => setCurrentSpan('')}
          addSpanFilter={addSpanFilter}
        />
      )}
    </>
  );
}

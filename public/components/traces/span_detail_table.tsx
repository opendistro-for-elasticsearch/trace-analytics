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

import { EuiDataGrid, EuiDataGridColumn, EuiLink } from '@elastic/eui';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CoreStart } from '../../../../../src/core/public';
import { DATE_FORMAT } from '../../../common';
import { handleSpansRequest } from '../../requests/traces_request_handler';
import { nanoToMilliSec } from '../common';

interface SpanDetailTableProps {
  http: CoreStart['http'];
  openFlyout: (spanId: string) => void;
  DSL?: any;
}

export interface SpanSearchParams {
  from: number;
  size: number;
  sortingColumns: Array<{
    [id: string]: 'asc' | 'desc';
  }>;
}

export function SpanDetailTable(props: SpanDetailTableProps) {
  const [tableParams, setTableParams] = useState({
    size: 10,
    page: 0,
    sortingColumns: [] as Array<{
      id: string;
      direction: 'asc' | 'desc';
    }>,
  });
  const [items, setItems] = useState<any>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const spanSearchParams: SpanSearchParams = {
      from: tableParams.page * tableParams.size,
      size: tableParams.size,
      sortingColumns: tableParams.sortingColumns.map(({ id, direction }) => ({ [id]: direction })),
    };
    handleSpansRequest(props.http, setItems, setTotal, spanSearchParams, props.DSL);
  }, [tableParams, props.DSL]);

  const columns: EuiDataGridColumn[] = [
    {
      id: 'spanId',
      display: 'Span ID',
    },
    {
      id: 'parentSpanId',
      display: 'Parent span ID',
    },
    {
      id: 'serviceName',
      display: 'Service',
    },
    {
      id: 'name',
      display: 'Operation',
    },
    {
      id: 'durationInNanos',
      display: 'Duration',
    },
    {
      id: 'startTime',
      display: 'Start time',
    },
    {
      id: 'endTime',
      display: 'End time',
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(() => columns.map(({ id }) => id));

  const renderCellValue = useMemo(() => {
    return ({ rowIndex, columnId }) => {
      let adjustedRowIndex = rowIndex - tableParams.page * tableParams.size;
      if (!items.hasOwnProperty(adjustedRowIndex)) return '-';
      const value = items[adjustedRowIndex][columnId];
      if (value == null || value === '') return '-';
      switch (columnId) {
        case 'spanId':
          return <EuiLink onClick={() => props.openFlyout(value)}>{value}</EuiLink>;
        case 'durationInNanos':
          return `${nanoToMilliSec(value)} ms`;
        case 'startTime':
        case 'endTime':
          return moment(value).format(DATE_FORMAT);

        default:
          return value;
      }
    };
  }, [items, tableParams.page, tableParams.size]);

  const onSort = useCallback(
    (sortingColumns) => {
      setTableParams({
        ...tableParams,
        sortingColumns,
      });
    },
    [setTableParams]
  );

  const onChangeItemsPerPage = useCallback((size) => setTableParams({ ...tableParams, size }), [
    setTableParams,
  ]);
  const onChangePage = useCallback((page) => setTableParams({ ...tableParams, page }), [
    setTableParams,
  ]);

  return (
    <>
      <EuiDataGrid
        aria-labelledby="span-detail-data-grid"
        columns={columns}
        columnVisibility={{ visibleColumns, setVisibleColumns }}
        rowCount={total}
        renderCellValue={renderCellValue}
        sorting={{ columns: tableParams.sortingColumns, onSort }}
        pagination={{
          pageIndex: tableParams.page,
          pageSize: tableParams.size,
          pageSizeOptions: [10, 50, 100],
          onChangeItemsPerPage: onChangeItemsPerPage,
          onChangePage: onChangePage,
        }}
      />
    </>
  );
}

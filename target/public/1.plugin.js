(window["opendistro-trace-analytics-kibana_bundle_jsonpfunction"] = window["opendistro-trace-analytics-kibana_bundle_jsonpfunction"] || []).push([[1],{

/***/ "../../packages/elastic-datemath/target/index.js":
/*!*******************************************************************************************!*\
  !*** /Users/lijshu/Projects/7.9.1/kibana-7.9.1/packages/elastic-datemath/target/index.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "moment"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var unitsMap = {
  ms: {
    weight: 1,
    type: 'fixed',
    base: 1
  },
  s: {
    weight: 2,
    type: 'fixed',
    base: 1000
  },
  m: {
    weight: 3,
    type: 'mixed',
    base: 1000 * 60
  },
  h: {
    weight: 4,
    type: 'mixed',
    base: 1000 * 60 * 60
  },
  d: {
    weight: 5,
    type: 'mixed',
    base: 1000 * 60 * 60 * 24
  },
  w: {
    weight: 6,
    type: 'calendar',
    base: NaN
  },
  M: {
    weight: 7,
    type: 'calendar',
    base: NaN
  },
  // q: { weight: 8, type: 'calendar' }, // TODO: moment duration does not support quarter
  y: {
    weight: 9,
    type: 'calendar',
    base: NaN
  }
};
var units = Object.keys(unitsMap).sort(function (a, b) {
  return unitsMap[b].weight - unitsMap[a].weight;
});

var unitsDesc = _toConsumableArray(units);

var unitsAsc = _toConsumableArray(units).reverse();

var isDate = function isDate(d) {
  return Object.prototype.toString.call(d) === '[object Date]';
};

var isValidDate = function isValidDate(d) {
  return isDate(d) && !isNaN(d.valueOf());
};
/*
 * This is a simplified version of elasticsearch's date parser.
 * If you pass in a momentjs instance as the third parameter the calculation
 * will be done using this (and its locale settings) instead of the one bundled
 * with this library.
 */


function parse(text) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$roundUp = _ref.roundUp,
      roundUp = _ref$roundUp === void 0 ? false : _ref$roundUp,
      _ref$momentInstance = _ref.momentInstance,
      momentInstance = _ref$momentInstance === void 0 ? _moment.default : _ref$momentInstance,
      forceNow = _ref.forceNow;

  if (!text) return undefined;
  if (momentInstance.isMoment(text)) return text;
  if (isDate(text)) return momentInstance(text);

  if (forceNow !== undefined && !isValidDate(forceNow)) {
    throw new Error('forceNow must be a valid Date');
  }

  var time;
  var mathString = '';
  var index;
  var parseString;

  if (text.substring(0, 3) === 'now') {
    time = momentInstance(forceNow);
    mathString = text.substring('now'.length);
  } else {
    index = text.indexOf('||');

    if (index === -1) {
      parseString = text;
      mathString = ''; // nothing else
    } else {
      parseString = text.substring(0, index);
      mathString = text.substring(index + 2);
    } // We're going to just require ISO8601 timestamps, k?


    time = momentInstance(parseString);
  }

  if (!mathString.length) {
    return time;
  }

  return parseDateMath(mathString, time, roundUp);
}

function parseDateMath(mathString, time, roundUp) {
  var dateTime = time;
  var len = mathString.length;
  var i = 0;

  while (i < len) {
    var c = mathString.charAt(i++);
    var type = void 0;
    var num = void 0;
    var unit = void 0;

    if (c === '/') {
      type = 0;
    } else if (c === '+') {
      type = 1;
    } else if (c === '-') {
      type = 2;
    } else {
      return;
    }

    if (isNaN(mathString.charAt(i))) {
      num = 1;
    } else if (mathString.length === 2) {
      num = mathString.charAt(i);
    } else {
      var numFrom = i;

      while (!isNaN(mathString.charAt(i))) {
        i++;
        if (i >= len) return;
      }

      num = parseInt(mathString.substring(numFrom, i), 10);
    }

    if (type === 0) {
      // rounding is only allowed on whole, single, units (eg M or 1M, not 0.5M or 2M)
      if (num !== 1) {
        return;
      }
    }

    unit = mathString.charAt(i++); // append additional characters in the unit

    for (var j = i; j < len; j++) {
      var unitChar = mathString.charAt(i);

      if (/[a-z]/i.test(unitChar)) {
        unit += unitChar;
        i++;
      } else {
        break;
      }
    }

    if (units.indexOf(unit) === -1) {
      return;
    } else {
      if (type === 0) {
        if (roundUp) dateTime.endOf(unit);else dateTime.startOf(unit);
      } else if (type === 1) {
        dateTime.add(num, unit);
      } else if (type === 2) {
        dateTime.subtract(num, unit);
      }
    }
  }

  return dateTime;
}

var _default = {
  parse: parse,
  unitsMap: Object.freeze(unitsMap),
  units: Object.freeze(units),
  unitsAsc: Object.freeze(unitsAsc),
  unitsDesc: Object.freeze(unitsDesc)
};
exports.default = _default;
module.exports = exports.default;

/***/ }),

/***/ "./public/application.tsx":
/*!********************************!*\
  !*** ./public/application.tsx ***!
  \********************************/
/*! exports provided: renderApp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderApp", function() { return renderApp; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/app */ "./public/components/app.tsx");
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



const renderApp = ({
  notifications,
  http,
  uiSettings,
  chrome
}, {
  navigation
}, {
  appBasePath,
  element
}) => {
  react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_app__WEBPACK_IMPORTED_MODULE_2__["TraceAnalyticsApp"], {
    basename: appBasePath,
    notifications: notifications,
    http: http,
    uiSettings: uiSettings,
    chrome: chrome,
    navigation: navigation
  }), element);
  return () => react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.unmountComponentAtNode(element);
};

/***/ }),

/***/ "./public/components/app.tsx":
/*!***********************************!*\
  !*** ./public/components/app.tsx ***!
  \***********************************/
/*! exports provided: TraceAnalyticsApp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TraceAnalyticsApp", function() { return TraceAnalyticsApp; });
/* harmony import */ var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @kbn/i18n/react */ "@kbn/i18n/react");
/* harmony import */ var _kbn_i18n_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _requests_request_handler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../requests/request_handler */ "./public/requests/request_handler.ts");
/* harmony import */ var _common_side_nav__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/side_nav */ "./public/components/common/side_nav.tsx");
/* harmony import */ var _dashboard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dashboard */ "./public/components/dashboard/index.ts");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./services */ "./public/components/services/index.ts");
/* harmony import */ var _traces__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./traces */ "./public/components/traces/index.ts");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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








const TraceAnalyticsApp = ({
  basename,
  notifications,
  http,
  uiSettings,
  chrome,
  navigation
}) => {
  const [indicesExist, setIndicesExist] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(true);
  const storedFilters = localStorage.getItem('TraceAnalyticsFilters');
  const [query, setQuery] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(localStorage.getItem('TraceAnalyticsQuery') || '');
  const [filters, setFilters] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(storedFilters ? JSON.parse(storedFilters) : []);
  const [startTime, setStartTime] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(localStorage.getItem('TraceAnalyticsStartTime') || 'now-5m');
  const [endTime, setEndTime] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(localStorage.getItem('TraceAnalyticsEndTime') || 'now');

  const setFiltersWithStorage = newFilters => {
    setFilters(newFilters);
    localStorage.setItem('TraceAnalyticsFilters', JSON.stringify(newFilters));
  };

  const setQueryWithStorage = newQuery => {
    setQuery(newQuery);
    localStorage.setItem('TraceAnalyticsQuery', newQuery);
  };

  const setStartTimeWithStorage = newStartTime => {
    setStartTime(newStartTime);
    localStorage.setItem('TraceAnalyticsStartTime', newStartTime);
  };

  const setEndTimeWithStorage = newEndTime => {
    setEndTime(newEndTime);
    localStorage.setItem('TraceAnalyticsEndTime', newEndTime);
  };

  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    Object(_requests_request_handler__WEBPACK_IMPORTED_MODULE_3__["handleIndicesExistRequest"])(http, setIndicesExist);
  }, []);
  const commonProps = {
    http,
    uiSettings,
    setBreadcrumbs: chrome.setBreadcrumbs,
    query,
    setQuery: setQueryWithStorage,
    filters,
    setFilters: setFiltersWithStorage,
    startTime,
    setStartTime: setStartTimeWithStorage,
    endTime,
    setEndTime: setEndTimeWithStorage,
    indicesExist
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["HashRouter"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_kbn_i18n_react__WEBPACK_IMPORTED_MODULE_0__["I18nProvider"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Switch"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
    exact: true,
    path: ['/dashboard', '/'],
    render: props => Object(_common_side_nav__WEBPACK_IMPORTED_MODULE_4__["renderPageWithSidebar"])( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_dashboard__WEBPACK_IMPORTED_MODULE_5__["Dashboard"], commonProps), 1)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
    exact: true,
    path: "/traces",
    render: props => Object(_common_side_nav__WEBPACK_IMPORTED_MODULE_4__["renderPageWithSidebar"])( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_traces__WEBPACK_IMPORTED_MODULE_7__["Traces"], commonProps), 2)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
    path: "/traces/:id+",
    render: props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_traces__WEBPACK_IMPORTED_MODULE_7__["TraceView"], {
      setBreadcrumbs: chrome.setBreadcrumbs,
      http: http,
      uiSettings: uiSettings,
      traceId: decodeURIComponent(props.match.params.id)
    })
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
    exact: true,
    path: "/services",
    render: props => Object(_common_side_nav__WEBPACK_IMPORTED_MODULE_4__["renderPageWithSidebar"])( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_services__WEBPACK_IMPORTED_MODULE_6__["Services"], commonProps), 3)
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
    path: "/services/:id+",
    render: props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_services__WEBPACK_IMPORTED_MODULE_6__["ServiceView"], _extends({
      serviceName: decodeURIComponent(props.match.params.id)
    }, commonProps, {
      addFilter: filter => {
        for (const addedFilter of filters) {
          if (addedFilter.field === filter.field && addedFilter.operator === filter.operator && addedFilter.value === filter.value) {
            return;
          }
        }

        const newFilters = [...filters, filter];
        setFiltersWithStorage(newFilters);
      }
    }))
  })))));
};

/***/ }),

/***/ "./public/components/common/color_palette.ts":
/*!***************************************************!*\
  !*** ./public/components/common/color_palette.ts ***!
  \***************************************************/
/*! exports provided: serviceMapColorPalette */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "serviceMapColorPalette", function() { return serviceMapColorPalette; });
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
const serviceMapColorPalette = {
  latency: ['218, 214, 227', '216, 212, 226', '215, 209, 226', '213, 207, 225', '212, 205, 224', '210, 202, 224', '208, 200, 223', '207, 198, 222', '205, 195, 222', '203, 193, 221', '202, 191, 220', '200, 189, 219', '198, 186, 218', '197, 184, 217', '195, 182, 216', '193, 180, 216', '192, 177, 215', '190, 175, 214', '188, 173, 213', '187, 171, 212', '185, 169, 211', '183, 166, 210', '182, 164, 209', '180, 162, 207', '178, 160, 206', '177, 158, 205', '175, 155, 204', '173, 153, 203', '171, 151, 202', '170, 149, 201', '168, 147, 200', '166, 145, 198', '165, 143, 197', '163, 140, 196', '161, 138, 195', '160, 136, 193', '158, 134, 192', '156, 132, 191', '154, 130, 190', '153, 128, 188', '151, 126, 187', '149, 124, 186', '148, 122, 184', '146, 120, 183', '144, 118, 182', '142, 116, 180', '141, 114, 179', '139, 111, 177', '137, 109, 176', '136, 107, 175', '134, 105, 173', '132, 103, 172', '131, 101, 170', '129, 99, 169', '127, 97, 167', '125, 95, 166', '124, 93, 164', '122, 91, 163', '120, 90, 161', '119, 88, 160', '117, 86, 158', '115, 84, 157', '113, 82, 155', '112, 80, 154', '110, 78, 152', '108, 76, 151', '107, 74, 149', '105, 72, 148', '103, 70, 146', '102, 68, 144', '100, 66, 143', '98, 64, 141', '97, 63, 140', '95, 61, 138', '93, 59, 136', '91, 57, 135', '90, 55, 133', '88, 53, 132', '86, 51, 130', '85, 49, 128', '83, 47, 127', '81, 46, 125', '80, 44, 123', '78, 42, 122', '76, 40, 120', '75, 38, 119', '73, 36, 117', '71, 34, 115', '70, 32, 114', '68, 31, 112', '66, 29, 110', '65, 27, 108', '63, 25, 107', '61, 23, 105', '59, 21, 103', '58, 19, 102', '56, 17, 100', '54, 15, 98', '53, 12, 97', '51, 10, 95'],
  error_rate: ['239, 224, 230', '239, 222, 228', '240, 219, 226', '240, 217, 224', '240, 214, 222', '240, 212, 221', '240, 209, 219', '240, 207, 217', '240, 204, 215', '240, 202, 213', '240, 200, 211', '240, 197, 209', '240, 195, 208', '239, 192, 206', '239, 190, 204', '239, 188, 202', '238, 185, 200', '238, 183, 198', '238, 181, 196', '237, 178, 195', '237, 176, 193', '236, 174, 191', '236, 172, 189', '235, 169, 187', '234, 167, 185', '234, 165, 184', '233, 163, 182', '232, 160, 180', '232, 158, 178', '231, 156, 176', '230, 154, 174', '229, 151, 173', '228, 149, 171', '227, 147, 169', '226, 145, 167', '225, 143, 165', '224, 141, 164', '223, 139, 162', '222, 136, 160', '221, 134, 158', '220, 132, 156', '219, 130, 155', '218, 128, 153', '217, 126, 151', '216, 124, 149', '214, 122, 147', '213, 120, 146', '212, 118, 144', '211, 116, 142', '209, 114, 140', '208, 112, 139', '207, 110, 137', '205, 108, 135', '204, 106, 133', '202, 104, 132', '201, 102, 130', '199, 100, 128', '198, 98, 126', '196, 96, 125', '195, 95, 123', '193, 93, 121', '192, 91, 119', '190, 89, 118', '189, 87, 116', '187, 85, 114', '186, 84, 113', '184, 82, 111', '182, 80, 109', '181, 78, 107', '179, 76, 106', '177, 75, 104', '175, 73, 102', '174, 71, 101', '172, 70, 99', '170, 68, 97', '168, 66, 96', '167, 65, 94', '165, 63, 92', '163, 61, 91', '161, 60, 89', '159, 58, 87', '157, 56, 86', '156, 55, 84', '154, 53, 83', '152, 52, 81', '150, 50, 79', '148, 49, 78', '146, 47, 76', '144, 46, 74', '142, 44, 73', '140, 43, 71', '138, 41, 70', '136, 40, 68', '134, 38, 66', '132, 37, 65', '130, 35, 63', '128, 34, 62', '126, 33, 60', '124, 31, 59', '122, 30, 57'],
  throughput: ['216, 218, 225', '214, 216, 225', '211, 214, 226', '209, 212, 226', '206, 210, 226', '204, 208, 226', '202, 206, 226', '199, 204, 226', '197, 202, 226', '195, 199, 226', '193, 197, 226', '190, 195, 225', '188, 193, 225', '186, 191, 225', '184, 189, 224', '181, 187, 224', '179, 185, 223', '177, 183, 223', '175, 181, 222', '173, 179, 221', '171, 177, 221', '168, 175, 220', '166, 173, 219', '164, 171, 218', '162, 169, 218', '160, 167, 217', '158, 165, 216', '156, 164, 215', '154, 162, 214', '152, 160, 213', '150, 158, 212', '148, 156, 211', '146, 154, 210', '144, 152, 209', '142, 150, 208', '140, 148, 207', '138, 146, 206', '136, 144, 205', '134, 142, 204', '132, 140, 203', '130, 138, 202', '128, 137, 200', '126, 135, 199', '124, 133, 198', '122, 131, 197', '120, 129, 196', '118, 127, 194', '116, 125, 193', '114, 123, 192', '112, 122, 191', '110, 120, 189', '108, 118, 188', '106, 116, 187', '105, 114, 186', '103, 112, 184', '101, 110, 183', '99, 109, 182', '97, 107, 180', '95, 105, 179', '93, 103, 178', '91, 101, 176', '89, 100, 175', '88, 98, 173', '86, 96, 172', '84, 94, 171', '82, 92, 169', '80, 91, 168', '78, 89, 166', '76, 87, 165', '74, 85, 163', '72, 84, 162', '70, 82, 161', '68, 80, 159', '67, 78, 158', '65, 77, 156', '63, 75, 155', '61, 73, 153', '59, 72, 152', '57, 70, 150', '55, 68, 149', '53, 66, 147', '51, 65, 146', '49, 63, 144', '47, 61, 143', '45, 60, 141', '42, 58, 140', '40, 56, 138', '38, 55, 137', '36, 53, 135', '34, 51, 134', '31, 50, 132', '29, 48, 130', '26, 47, 129', '23, 45, 127', '20, 43, 126', '17, 42, 124', '14, 40, 123', '9, 39, 121', '5, 37, 120', '1, 36, 118']
};

/***/ }),

/***/ "./public/components/common/filters/filter_edit_popover.tsx":
/*!******************************************************************!*\
  !*** ./public/components/common/filters/filter_edit_popover.tsx ***!
  \******************************************************************/
/*! exports provided: FilterEditPopover */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FilterEditPopover", function() { return FilterEditPopover; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _filter_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filter_helpers */ "./public/components/common/filters/filter_helpers.tsx");
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



function FilterEditPopover(props) {
  var _props$filter, _selectedOperatorOpti, _selectedOperatorOpti2;

  const [selectedFieldOptions, setSelectedFieldOptions] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(props.filter ? [{
    label: props.filter.field
  }] : []);
  const [selectedOperatorOptions, setSelectedOperatorOptions] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(props.filter ? [{
    label: Object(_filter_helpers__WEBPACK_IMPORTED_MODULE_2__["getInvertedOperator"])(props.filter.operator, props.filter.inverted)
  }] : []);
  const [filterValue, setFilterValue] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(((_props$filter = props.filter) === null || _props$filter === void 0 ? void 0 : _props$filter.value) || '');
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    style: {
      width: 400
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("button", {
    style: {
      width: 0,
      height: 0,
      position: 'fixed',
      marginLeft: -1000,
      bottom: 0
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
    gutterSize: "s"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: 6
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFormRow"], {
    label: 'Field'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiComboBox"], {
    placeholder: "Select a field first",
    isClearable: false,
    options: props.filterFieldOptions,
    selectedOptions: selectedFieldOptions,
    onChange: e => {
      setSelectedFieldOptions(e);
      setSelectedOperatorOptions([]);
      setFilterValue('');
    },
    singleSelection: {
      asPlainText: true
    }
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: 5
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFormRow"], {
    label: 'Operator'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiComboBox"], {
    placeholder: selectedFieldOptions.length === 0 ? 'Waiting' : 'Select',
    isClearable: false,
    isDisabled: selectedFieldOptions.length === 0,
    options: selectedFieldOptions.length === 0 ? [] : Object(_filter_helpers__WEBPACK_IMPORTED_MODULE_2__["getOperatorOptions"])(selectedFieldOptions[0].label),
    selectedOptions: selectedOperatorOptions,
    onChange: e => {
      setSelectedOperatorOptions(e);
      setFilterValue('');
    },
    singleSelection: {
      asPlainText: true
    }
  })))), selectedOperatorOptions.length > 0 && Object(_filter_helpers__WEBPACK_IMPORTED_MODULE_2__["getValueComponent"])(selectedFieldOptions[0].label, selectedOperatorOptions[0].label, filterValue, setFilterValue), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
    size: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
    gutterSize: "s",
    justifyContent: "flexEnd"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiButtonEmpty"], {
    "data-test-subj": "filter-popover-cancel-button",
    onClick: props.closePopover
  }, "Cancel")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiButton"], {
    fill: true,
    disabled: selectedFieldOptions.length === 0 || selectedOperatorOptions.length === 0 || filterValue.length === 0 && !((_selectedOperatorOpti = selectedOperatorOptions[0]) !== null && _selectedOperatorOpti !== void 0 && (_selectedOperatorOpti2 = _selectedOperatorOpti.label) !== null && _selectedOperatorOpti2 !== void 0 && _selectedOperatorOpti2.includes('exist')),
    onClick: () => {
      props.closePopover();
      props.setFilter({
        field: selectedFieldOptions[0].label,
        operator: selectedOperatorOptions[0].label,
        value: selectedOperatorOptions[0].label.includes('exist') ? 'exists' : filterValue,
        inverted: selectedOperatorOptions[0].label.includes('not'),
        disabled: props.filter ? props.filter.disabled : false
      }, props.index);
    }
  }, "Save"))));
}

/***/ }),

/***/ "./public/components/common/filters/filter_helpers.tsx":
/*!*************************************************************!*\
  !*** ./public/components/common/filters/filter_helpers.tsx ***!
  \*************************************************************/
/*! exports provided: getFilterFields, getValidFilterFields, getInvertedOperator, getOperatorOptions, getValueComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFilterFields", function() { return getFilterFields; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getValidFilterFields", function() { return getValidFilterFields; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInvertedOperator", function() { return getInvertedOperator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOperatorOptions", function() { return getOperatorOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getValueComponent", function() { return getValueComponent; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
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




const getFields = page => ({
  dashboard: ['traceGroup.name', 'serviceName', 'error', 'status.message', 'latency'],
  traces: ['traceId', 'traceGroup.name', 'serviceName', 'error', 'status.message', 'latency'],
  services: ['traceGroup.name', 'serviceName', 'error', 'status.message', 'latency']
})[page]; // filters will take effect and can be manually added


const getFilterFields = page => getFields(page); // filters will take effect

const getValidFilterFields = page => {
  const fields = getFields(page);
  if (page !== 'services') return [...fields, 'Latency percentile within trace group'];
  return fields;
};

const getType = field => {
  const typeMapping = {
    attributes: {
      host: {
        port: 'long'
      },
      http: {
        response_content_length: 'long',
        status_code: 'long'
      },
      net: {
        port: 'long'
      }
    },
    attributes_host: {
      port: 'long'
    },
    attributes_http: {
      response_content_length: 'long',
      status_code: 'long'
    },
    attributes_net: {
      port: 'long'
    },
    durationInNanos: 'long',
    latency: 'long',
    endTime: 'date_nanos',
    startTime: 'date_nanos'
  };

  const type = lodash__WEBPACK_IMPORTED_MODULE_1___default.a.get(typeMapping, field, 'keyword');

  return typeof type === 'string' ? type : null;
};

const getInvertedOperator = (operator, inverted) => {
  if (operator.includes('between')) return inverted ? 'is not between' : 'is between';else if (operator.includes('exist')) return inverted ? 'does not exist' : 'exists';else if (operator === 'is' || operator === 'is not') return inverted ? 'is not' : 'is';
};
const getOperatorOptions = field => {
  const type = getType(field);
  const operatorMapping = {
    long: [{
      label: 'is between'
    }, {
      label: 'is not between'
    }],
    date_nanos: [{
      label: 'is between'
    }, {
      label: 'is not between'
    }],
    keyword: [],
    default_first: [{
      label: 'is'
    }, {
      label: 'is not'
    }],
    default_last: [{
      label: 'exists'
    }, {
      label: 'does not exist'
    }]
  };
  const operators = [...operatorMapping.default_first, ...operatorMapping[type], ...operatorMapping.default_last];
  return operators;
};
const getValueComponent = (field, operator, value, setValue) => {
  const textField = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
    size: "s"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFormRow"], {
    label: 'Value'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFieldText"], {
    placeholder: "Enter a value",
    value: value,
    onChange: e => setValue(e.target.value)
  })));

  const getRangeField = () => {
    const getFromValue = () => {
      if (value !== null && value !== void 0 && value.from) {
        return value.from.includes('\u221E') ? '' : value.from;
      }

      return '';
    };

    const getToValue = () => {
      if (value !== null && value !== void 0 && value.to) {
        return value.to.includes('\u221E') ? '' : value.to;
      }

      return '';
    };

    const setFromValue = from => {
      setValue({
        from: from || '-\u221E',
        to: getToValue() || '\u221E'
      });
    };

    const setToValue = to => {
      setValue({
        from: getFromValue() || '-\u221E',
        to: to || '\u221E'
      });
    };

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
      size: "s"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFormRow"], {
      label: 'Value'
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFormControlLayoutDelimited"], {
      startControl: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("input", {
        type: "string",
        placeholder: "Start of range",
        className: "euiFieldText",
        value: getFromValue(),
        onChange: e => setFromValue(e.target.value)
      }),
      endControl: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("input", {
        type: "string",
        placeholder: "End of range",
        className: "euiFieldText",
        value: getToValue(),
        onChange: e => setToValue(e.target.value)
      })
    })));
  };

  const getComboBoxField = () => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
      size: "s"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFormRow"], {
      label: 'Value'
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiComboBox"], {
      placeholder: "Select a value",
      options: [{
        label: 'true'
      }, {
        label: 'false'
      }],
      onChange: setValue,
      selectedOptions: value || [],
      singleSelection: true
    })));
  };

  if (field === 'error' && (operator === 'is' || operator === 'is not')) {
    return getComboBoxField();
  }

  const valueMapping = {
    is: textField,
    'is not': textField,
    'is between': getRangeField(),
    'is not between': getRangeField(),
    exists: null,
    'does not exist': null
  };
  return valueMapping[operator];
};

/***/ }),

/***/ "./public/components/common/filters/filters.tsx":
/*!******************************************************!*\
  !*** ./public/components/common/filters/filters.tsx ***!
  \******************************************************/
/*! exports provided: Filters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Filters", function() { return Filters; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _filter_edit_popover__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./filter_edit_popover */ "./public/components/common/filters/filter_edit_popover.tsx");
/* harmony import */ var _filter_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./filter_helpers */ "./public/components/common/filters/filter_helpers.tsx");
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




function Filters(props) {
  // set a filter at an index. if newFilter doesn't exist, remove filter at the index
  // if index doesn't exist, append newFilter to the end
  const setFilter = (newFilter, index) => {
    const newFilters = [...props.filters];
    if (newFilter) newFilters.splice(index, 1, newFilter);else newFilters.splice(index, 1);
    props.setFilters(newFilters);
  };

  const validFilterFields = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(() => Object(_filter_helpers__WEBPACK_IMPORTED_MODULE_3__["getValidFilterFields"])(props.page), [props.page]);
  const filterFieldOptions = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(() => Object(_filter_helpers__WEBPACK_IMPORTED_MODULE_3__["getFilterFields"])(props.page).map(field => ({
    label: field
  })), [props.page]);
  const globalPopoverPanels = [{
    id: 0,
    title: 'Change all filters',
    items: [{
      name: 'Enable all',
      icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
        type: "eye",
        size: "m"
      }),
      onClick: () => {
        props.setFilters(props.filters.map(filter => ({ ...filter,
          disabled: filter.locked ? filter.disabled : false
        })));
      }
    }, {
      name: 'Disable all',
      icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
        type: "eyeClosed",
        size: "m"
      }),
      onClick: () => {
        props.setFilters(props.filters.map(filter => ({ ...filter,
          disabled: filter.locked ? filter.disabled : true
        })));
      }
    }, {
      name: 'Invert inclusion',
      icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
        type: "invert",
        size: "m"
      }),
      onClick: () => {
        props.setFilters( // if filter.custom.query exists, it's a customized filter and "inverted" is alwasy false
        props.filters.map(filter => {
          var _filter$custom;

          return { ...filter,
            inverted: filter.locked ? filter.inverted : (_filter$custom = filter.custom) !== null && _filter$custom !== void 0 && _filter$custom.query ? false : !filter.inverted
          };
        }));
      }
    }, {
      name: 'Invert enabled/disabled',
      icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
        type: "eye",
        size: "m"
      }),
      onClick: () => {
        props.setFilters(props.filters.map(filter => ({ ...filter,
          disabled: filter.locked ? filter.disabled : !filter.disabled
        })));
      }
    }, {
      name: 'Remove all',
      icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
        type: "trash",
        size: "m"
      }),
      onClick: () => {
        props.setFilters([]);
      }
    }]
  }];

  const getFilterPopoverPanels = (filter, index, closePopover) => {
    var _filter$custom2, _filter$custom3;

    return [{
      id: 0,
      items: [{
        name: 'Edit filter',
        icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
          type: "invert",
          size: "m"
        }),
        disabled: !!((_filter$custom2 = filter.custom) !== null && _filter$custom2 !== void 0 && _filter$custom2.query) || validFilterFields.indexOf(filter.field) === -1,
        panel: 1
      }, {
        name: `${filter.inverted ? 'Include' : 'Exclude'} results`,
        icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
          type: filter.inverted ? 'plusInCircle' : 'minusInCircle',
          size: "m"
        }),
        disabled: !!((_filter$custom3 = filter.custom) !== null && _filter$custom3 !== void 0 && _filter$custom3.query) || validFilterFields.indexOf(filter.field) === -1,
        onClick: () => {
          filter.inverted = !filter.inverted;
          setFilter(filter, index);
        }
      }, {
        name: filter.disabled ? 'Re-enable' : 'Temporarily disable',
        icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
          type: filter.disabled ? 'eye' : 'eyeClosed',
          size: "m"
        }),
        disabled: validFilterFields.indexOf(filter.field) === -1,
        onClick: () => {
          filter.disabled = !filter.disabled;
          setFilter(filter, index);
        }
      }, {
        name: 'Delete',
        icon: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
          type: "trash",
          size: "m"
        }),
        onClick: () => setFilter(null, index)
      }]
    }, {
      id: 1,
      width: 430,
      title: 'Edit filter',
      content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        style: {
          margin: 15
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_filter_edit_popover__WEBPACK_IMPORTED_MODULE_2__["FilterEditPopover"], {
        filterFieldOptions: filterFieldOptions,
        filter: filter,
        index: index,
        setFilter: setFilter,
        closePopover: closePopover
      }))
    }];
  };

  const GlobalFilterButton = () => {
    const [isPopoverOpen, setIsPopoverOpen] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPopover"], {
      isOpen: isPopoverOpen,
      closePopover: () => setIsPopoverOpen(false),
      button: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiButtonIcon"], {
        onClick: () => setIsPopoverOpen(true),
        iconType: "filter",
        title: "Change all filters",
        "aria-label": "Change all filters"
      }),
      anchorPosition: "rightUp",
      panelPaddingSize: "none",
      withTitle: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiContextMenu"], {
      initialPanelId: 0,
      panels: globalPopoverPanels
    }));
  };

  const AddFilterButton = () => {
    const [isPopoverOpen, setIsPopoverOpen] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false);
    const button = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiButtonEmpty"], {
      size: "xs",
      onClick: () => {
        setIsPopoverOpen(true);
      }
    }, "+ Add filter");
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPopover"], {
      button: button,
      isOpen: isPopoverOpen,
      closePopover: () => setIsPopoverOpen(false),
      anchorPosition: "downLeft",
      withTitle: true
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPopoverTitle"], null, 'Add filter'), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_filter_edit_popover__WEBPACK_IMPORTED_MODULE_2__["FilterEditPopover"], {
      filterFieldOptions: filterFieldOptions,
      index: props.filters.length,
      setFilter: setFilter,
      closePopover: () => setIsPopoverOpen(false)
    }));
  };

  const renderFilters = () => {
    const FilterBadge = ({
      filter,
      index
    }) => {
      const [isPopoverOpen, setIsPopoverOpen] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false);
      const disabled = filter.locked || filter.disabled;
      const className = 'globalFilterItem' + (disabled ? ' globalFilterItem-isDisabled' : '') + (filter.inverted ? ' globalFilterItem-isExcluded' : '');
      const value = typeof filter.value === 'string' ? filter.value : Array.isArray(filter.value) // combo box
      ? filter.value[0].label : `${filter.value.from} to ${filter.value.to}`; // range selector

      const filterLabel = filter.inverted ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiTextColor"], {
        color: disabled ? 'default' : 'danger'
      }, 'NOT '), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiTextColor"], {
        color: "default"
      }, `${filter.field}: ${value}`)) : `${filter.field}: ${value}`;
      const badge = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiBadge"], {
        className: className,
        onClick: () => setIsPopoverOpen(true),
        onClickAriaLabel: "Open filter settings",
        color: disabled ? '#e7e9f0' : 'hollow',
        iconType: "cross",
        iconSide: "right",
        iconOnClick: () => {
          setFilter(null, index);
        },
        iconOnClickAriaLabel: "Remove filter"
      }, filterLabel);
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
        grow: false,
        key: `filter-${index}`
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPopover"], {
        isOpen: isPopoverOpen,
        closePopover: () => setIsPopoverOpen(false),
        panelPaddingSize: "none",
        button: badge
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiContextMenu"], {
        initialPanelId: 0,
        panels: getFilterPopoverPanels(filter, index, () => setIsPopoverOpen(false))
      })));
    };

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, props.filters.length > 0 ? props.filters.map((filter, i) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(FilterBadge, {
      filter: filter,
      index: i,
      key: i
    })) : null);
  };

  const filterComponents = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(() => renderFilters(), [props.filters]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
    gutterSize: "xs",
    alignItems: "center",
    responsive: false,
    style: {
      minHeight: 32
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(GlobalFilterButton, null)), filterComponents, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(AddFilterButton, null)));
}

/***/ }),

/***/ "./public/components/common/helper_functions.tsx":
/*!*******************************************************!*\
  !*** ./public/components/common/helper_functions.tsx ***!
  \*******************************************************/
/*! exports provided: PanelTitle, NoMatchMessage, MissingConfigurationMessage, renderBenchmark, nanoToMilliSec, milliToNanoSec, getServiceMapScaleColor, getServiceMapGraph, getServiceMapTargetResources, calculateTicks, minFixedInterval, fixedIntervalToMilli, fixedIntervalToTickFormat, getPercentileFilter, filtersToDsl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PanelTitle", function() { return PanelTitle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NoMatchMessage", function() { return NoMatchMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MissingConfigurationMessage", function() { return MissingConfigurationMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderBenchmark", function() { return renderBenchmark; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nanoToMilliSec", function() { return nanoToMilliSec; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "milliToNanoSec", function() { return milliToNanoSec; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getServiceMapScaleColor", function() { return getServiceMapScaleColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getServiceMapGraph", function() { return getServiceMapGraph; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getServiceMapTargetResources", function() { return getServiceMapTargetResources; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculateTicks", function() { return calculateTicks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "minFixedInterval", function() { return minFixedInterval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fixedIntervalToMilli", function() { return fixedIntervalToMilli; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fixedIntervalToTickFormat", function() { return fixedIntervalToTickFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPercentileFilter", function() { return getPercentileFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filtersToDsl", function() { return filtersToDsl; });
/* harmony import */ var _elastic_datemath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/datemath */ "../../packages/elastic-datemath/target/index.js");
/* harmony import */ var _elastic_datemath__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_datemath__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../common */ "./common/index.ts");
/* harmony import */ var _color_palette__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./color_palette */ "./public/components/common/color_palette.ts");
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





function PanelTitle({
  title,
  totalItems
}) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
    size: "m"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("span", {
    className: "panel-title"
  }, title), totalItems === 0 || totalItems ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("span", {
    className: "panel-title-count"
  }, ` (${totalItems})`) : null);
}
function NoMatchMessage(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
    size: props.size
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiEmptyPrompt"], {
    title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h2", null, "No matches"),
    body: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], null, "No data matches the selected filter. Clear the filter and/or increase the time range to see more results.")
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiSpacer"], {
    size: props.size
  }));
}
function MissingConfigurationMessage() {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiEmptyPrompt"], {
    title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h2", null, "Trace Analytics not set up"),
    body: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], null, `The indices required for trace analytics (${_common__WEBPACK_IMPORTED_MODULE_3__["RAW_INDEX_NAME"]} and ${_common__WEBPACK_IMPORTED_MODULE_3__["SERVICE_MAP_INDEX_NAME"]}) do not exist or you do not have permission to access them.`),
    actions: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiButton"], {
      color: "primary",
      iconSide: "right",
      iconType: "popout",
      onClick: () => window.open(_common__WEBPACK_IMPORTED_MODULE_3__["DOCUMENTATION_LINK"], '_blank')
    }, "Learn more")
  }));
}
function renderBenchmark(value) {
  if (typeof value !== 'number') return null;
  const benchmarkColor = value === 0 ? '#9ea8a9' : value > 0 ? '#c23f25' : '#3f7e23';
  const benchmarkArrow = value === 0 ? '-' : value > 0 ? '\u25B4' : '\u25BE';
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_1__["EuiText"], {
    size: "s",
    style: {
      color: benchmarkColor
    }
  }, `${Math.abs(value)}% ${benchmarkArrow}`);
}
function nanoToMilliSec(nano) {
  if (typeof nano !== 'number') return 0;
  return nano / 1000000;
}
function milliToNanoSec(ms) {
  if (typeof ms !== 'number') return 0;
  return ms * 1000000;
}
function getServiceMapScaleColor(percent, idSelected) {
  return _color_palette__WEBPACK_IMPORTED_MODULE_4__["serviceMapColorPalette"][idSelected][Math.min(99, Math.max(0, Math.floor(percent * 100)))];
} // construct vis-js graph from ServiceObject

function getServiceMapGraph(map, idSelected, ticks, currService, relatedServices) {
  if (!relatedServices) relatedServices = Object.keys(map);
  const nodes = Object.keys(map).map(service => {
    const value = map[service][idSelected];
    let color = '140, 148, 169';

    if (value || value === 0) {
      const percent = (value - ticks[0]) / (ticks[ticks.length - 1] - ticks[0]);
      color = getServiceMapScaleColor(percent, idSelected);
    }

    const message = {
      latency: 'Average latency: ',
      error_rate: 'Error rate: ',
      throughput: 'Throughput: '
    }[idSelected] + (value >= 0 ? value + (idSelected === 'latency' ? 'ms' : idSelected === 'error_rate' ? '%' : '') : 'N/A');
    return {
      id: map[service].id,
      label: service,
      size: service === currService ? 30 : 15,
      title: `<p>${service}</p><p>${message}</p>`,
      color: relatedServices.indexOf(service) >= 0 ? `rgba(${color}, 1)` : `rgba(${color}, 0.3)`
    };
  });
  const edges = [];
  Object.keys(map).map(service => {
    map[service].targetServices.map(target => {
      edges.push({
        from: map[service].id,
        to: map[target].id,
        color: relatedServices.indexOf(service) >= 0 && relatedServices.indexOf(target) >= 0 ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)'
      });
    });
  });
  return {
    graph: {
      nodes,
      edges
    }
  };
} // returns flattened targetResource as an array for all traceGroups

function getServiceMapTargetResources(map, serviceName) {
  return [].concat.apply([], [...map[serviceName].traceGroups.map(traceGroup => [...traceGroup.targetResource])]);
}
function calculateTicks(min, max, numTicks = 5) {
  if (min >= max) return calculateTicks(0, Math.max(1, max), numTicks);
  min = Math.floor(min);
  max = Math.ceil(max);
  const range = max - min;
  const minInterval = range / numTicks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(minInterval)));
  const residue = Math.ceil(minInterval / magnitude);
  let tick = magnitude;
  if (residue > 5) tick *= 10;else if (residue > 2) tick *= 5;else if (residue > 1) tick *= 2;
  let curr = Math.max(0, Math.floor((min - 1) / tick) * tick);
  const ticks = [curr];

  while (curr < max) {
    curr += tick;
    ticks.push(curr);
  }

  return ticks;
} // calculates the minimum fixed_interval for date_histogram from time filter

const minFixedInterval = (startTime, endTime) => {
  if ((startTime === null || startTime === void 0 ? void 0 : startTime.length) === 0 || (endTime === null || endTime === void 0 ? void 0 : endTime.length) === 0 || startTime === endTime) return '1d';
  const momentStart = _elastic_datemath__WEBPACK_IMPORTED_MODULE_0___default.a.parse(startTime);
  const momentEnd = _elastic_datemath__WEBPACK_IMPORTED_MODULE_0___default.a.parse(endTime);
  const diffSeconds = momentEnd.unix() - momentStart.unix();
  if (diffSeconds <= 1) return '1ms'; // less than 1 second

  if (diffSeconds <= 60 * 2) return '1s'; // less than 2 minutes

  if (diffSeconds <= 3600 * 2) return '1m'; // less than 2 hours

  if (diffSeconds <= 86400 * 2) return '1h'; // less than 2 days

  if (diffSeconds <= 86400 * 62) return '1d'; // less than 2 months

  if (diffSeconds <= 86400 * 366) return '30d'; // less than 1 year

  return '365d';
};
const fixedIntervalToMilli = fixedInterval => {
  return {
    '1ms': 1,
    '1s': 1000,
    '1m': 60000,
    '1h': 3600000,
    '1d': 86400000,
    '30d': 86400000 * 30,
    '365d': 86400000 * 365
  }[fixedInterval];
};
const fixedIntervalToTickFormat = fixedInterval => {
  if (fixedInterval === '1d') return '%b %e, %Y';
  if (fixedInterval === '30d') return '%b %Y';
  if (fixedInterval === '365d') return '%Y';
  return '';
};
const getPercentileFilter = (percentileMaps, conditionString) => {
  const DSL = {
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
        must_not: [],
        minimum_should_match: 1
      }
    }
  };
  percentileMaps.forEach(map => {
    DSL.query.bool.should.push({
      bool: {
        must: [{
          term: {
            'traceGroup.name': {
              value: map.traceGroupName
            }
          }
        }, {
          range: {
            'traceGroup.durationInNanos': map.durationFilter
          }
        }]
      }
    });
  });
  console.log('DSL', DSL);
  return {
    field: 'Latency percentile within trace group',
    operator: '',
    value: conditionString,
    inverted: false,
    disabled: false,
    custom: DSL
  };
};
const filtersToDsl = (filters, query, startTime, endTime) => {
  const DSL = {
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
        must_not: []
      }
    },
    custom: {
      timeFilter: [],
      serviceNames: [],
      serviceNamesExclude: [],
      traceGroup: [],
      traceGroupExclude: [],
      percentiles: {
        query: {
          bool: {
            should: []
          }
        }
      }
    }
  };
  const timeFilter = {
    range: {
      startTime: {
        gte: startTime,
        lte: endTime
      }
    }
  };
  DSL.query.bool.must.push(timeFilter);
  DSL.custom.timeFilter.push(timeFilter);

  if (query.length > 0) {
    DSL.query.bool.must.push({
      query_string: {
        query
      }
    });
  }

  filters.filter(filter => !filter.disabled && !filter.locked).forEach(filter => {
    var _filter$custom;

    if ((_filter$custom = filter.custom) !== null && _filter$custom !== void 0 && _filter$custom.query) {
      // add percentile filter
      DSL.query.bool.should.push(...filter.custom.query.bool.should);
      DSL.custom.percentiles.query.bool.should.push(...filter.custom.query.bool.should);
      DSL.query.bool.minimum_should_match = filter.custom.query.bool.minimum_should_match;
      DSL.custom.percentiles.query.bool.minimum_should_match = filter.custom.query.bool.minimum_should_match;
      return;
    }

    let filterQuery = {};
    let field = filter.field;
    if (field === 'latency') field = 'traceGroup.durationInNanos';else if (field === 'error') field = 'traceGroup.statusCode';
    let value;

    switch (filter.operator) {
      case 'exists':
      case 'does not exist':
        filterQuery = {
          exists: {
            field
          }
        };
        break;

      case 'is':
      case 'is not':
        value = filter.value; // latency and error are not actual fields, need to convert first

        if (field === 'traceGroup.durationInNanos') {
          value = milliToNanoSec(value);
        } else if (field === 'traceGroup.statusCode') {
          value = value[0].label === 'true' ? '2' : '0';
        }

        filterQuery = {
          term: {
            [field]: value
          }
        };
        break;

      case 'is between':
      case 'is not between':
        const range = {};
        if (!filter.value.from.includes('\u221E')) range.gte = filter.value.from;
        if (!filter.value.to.includes('\u221E')) range.lte = filter.value.to;

        if (field === 'traceGroup.durationInNanos') {
          if (range.lte) range.lte = milliToNanoSec(parseInt(range.lte || '')).toString();
          if (range.gte) range.gte = milliToNanoSec(parseInt(range.gte || '')).toString();
        }

        filterQuery = {
          range: {
            [field]: range
          }
        };
        break;

      default:
        break;
    }

    DSL.query.bool[filter.inverted ? 'must_not' : 'must'].push(filterQuery);
  });
  return DSL;
};

/***/ }),

/***/ "./public/components/common/index.ts":
/*!*******************************************!*\
  !*** ./public/components/common/index.ts ***!
  \*******************************************/
/*! exports provided: PanelTitle, NoMatchMessage, MissingConfigurationMessage, renderBenchmark, nanoToMilliSec, milliToNanoSec, getServiceMapScaleColor, getServiceMapGraph, getServiceMapTargetResources, calculateTicks, minFixedInterval, fixedIntervalToMilli, fixedIntervalToTickFormat, getPercentileFilter, filtersToDsl, SearchBar, SearchBarProps, renderDatePicker, Plt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helper_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper_functions */ "./public/components/common/helper_functions.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PanelTitle", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["PanelTitle"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NoMatchMessage", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["NoMatchMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MissingConfigurationMessage", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["MissingConfigurationMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "renderBenchmark", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["renderBenchmark"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "nanoToMilliSec", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["nanoToMilliSec"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "milliToNanoSec", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["milliToNanoSec"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getServiceMapScaleColor", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["getServiceMapScaleColor"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getServiceMapGraph", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["getServiceMapGraph"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getServiceMapTargetResources", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["getServiceMapTargetResources"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "calculateTicks", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["calculateTicks"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "minFixedInterval", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["minFixedInterval"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fixedIntervalToMilli", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["fixedIntervalToMilli"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fixedIntervalToTickFormat", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["fixedIntervalToTickFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getPercentileFilter", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["getPercentileFilter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "filtersToDsl", function() { return _helper_functions__WEBPACK_IMPORTED_MODULE_0__["filtersToDsl"]; });

/* harmony import */ var _search_bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./search_bar */ "./public/components/common/search_bar.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SearchBar", function() { return _search_bar__WEBPACK_IMPORTED_MODULE_1__["SearchBar"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SearchBarProps", function() { return _search_bar__WEBPACK_IMPORTED_MODULE_1__["SearchBarProps"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "renderDatePicker", function() { return _search_bar__WEBPACK_IMPORTED_MODULE_1__["renderDatePicker"]; });

/* harmony import */ var _plots_plt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./plots/plt */ "./public/components/common/plots/plt.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Plt", function() { return _plots_plt__WEBPACK_IMPORTED_MODULE_2__["Plt"]; });

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




/***/ }),

/***/ "./public/components/common/plots/box_plt.tsx":
/*!****************************************************!*\
  !*** ./public/components/common/plots/box_plt.tsx ***!
  \****************************************************/
/*! exports provided: BoxPlt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoxPlt", function() { return BoxPlt; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _plt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./plt */ "./public/components/common/plots/plt.tsx");
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



function BoxPlt({
  plotParams
}) {
  const [hovered, setHovered] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])('');

  const getLayout = () => ({
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    xaxis: {
      range: [plotParams.min, plotParams.max],
      fixedrange: true,
      showgrid: false,
      visible: false
    },
    yaxis: {
      range: [-0.6, 0.6],
      fixedrange: true,
      showgrid: false,
      visible: false
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
    height: 15,
    width: 250
  });

  const getData = () => [{
    x: [plotParams.left],
    y: [0],
    type: 'bar',
    orientation: 'h',
    width: 1,
    marker: {
      color: 'rgba(0, 0, 0, 0)'
    },
    hoverinfo: 'none',
    showlegend: false
  }, {
    x: [plotParams.mid - plotParams.left],
    y: [0],
    type: 'bar',
    orientation: 'h',
    width: 1,
    marker: {
      color: plotParams.currPercentileFilter === '< 95th' ? '#fcfcfc' : '#ffffff',
      line: {
        color: plotParams.currPercentileFilter === '< 95th' ? '#eceded' : hovered === 'lower' ? '#2e73b5' : '#957ac9',
        width: hovered === 'lower' ? 3 : 1
      }
    }
  }, {
    x: [plotParams.right - plotParams.mid],
    y: [0],
    type: 'bar',
    orientation: 'h',
    width: 1,
    marker: {
      color: plotParams.currPercentileFilter === '>= 95th' ? '#aea4d1' : '#957ac9',
      line: {
        color: hovered === 'upper' ? '#2e73b5' : '#957ac9',
        width: hovered === 'upper' ? 3 : 1
      }
    }
  }];

  const renderTooltip = () => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGrid"], {
      columns: 2,
      gutterSize: "s",
      responsive: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "xs",
      style: {
        color: hovered === 'lower' ? '#ffffff' : '#c9cbce'
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("p", null, "Latency <95 percentile"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "xs",
      style: {
        color: hovered === 'lower' ? '#ffffff' : '#c9cbce'
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("p", null, `${Math.round(plotParams.left)}ms - ${Math.round(plotParams.mid)}ms`))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "xs",
      style: {
        color: hovered === 'upper' ? '#ffffff' : '#c9cbce'
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("p", null, "Latency >=95 percentile"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "xs",
      style: {
        color: hovered === 'upper' ? '#ffffff' : '#c9cbce'
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("p", null, `${Math.round(plotParams.mid)}ms - ${Math.round(plotParams.right)}ms`))));
  };

  const layout = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(() => getLayout(), [plotParams]);
  const data = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(() => getData(), [plotParams, hovered]);
  const tooltip = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(() => renderTooltip(), [plotParams, hovered]);

  const onHoverHandler = e => {
    if (plotParams.currPercentileFilter) return;
    const mouseX = e.xvals[0];
    if (plotParams.left <= mouseX && mouseX <= plotParams.mid) setHovered('lower');else if (plotParams.mid <= mouseX && mouseX <= plotParams.right) setHovered('upper');else setHovered('');
  };

  const onClickHandler = e => {
    if (plotParams.currPercentileFilter) return;
    if (e.points[0].fullData.index === 1) plotParams.addFilter('lte');else if (e.points[0].fullData.index === 2) plotParams.addFilter('gte');
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiToolTip"], {
    content: tooltip,
    position: "bottom",
    onMouseOut: () => setHovered('')
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_plt__WEBPACK_IMPORTED_MODULE_2__["Plt"], {
    data: data,
    layout: layout,
    onHoverHandler: onHoverHandler,
    onClickHandler: onClickHandler
  })));
}

/***/ }),

/***/ "./public/components/common/plots/error_rate_plt.tsx":
/*!***********************************************************!*\
  !*** ./public/components/common/plots/error_rate_plt.tsx ***!
  \***********************************************************/
/*! exports provided: ErrorRatePlt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorRatePlt", function() { return ErrorRatePlt; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! .. */ "./public/components/common/index.ts");
/* harmony import */ var _plt__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./plt */ "./public/components/common/plots/plt.tsx");
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





function ErrorRatePlt(props) {
  var _props$items, _props$items$items;

  const getLayout = () => {
    var _props$items$items$, _props$items$items$2, _props$items$items$3, _props$items$items$4, _props$items$items$5;

    return {
      height: 217,
      margin: {
        l: 57,
        r: 5,
        b: 50,
        t: 30,
        pad: 4
      },
      annotations: props.items.items.length > 0 && [{
        x: (_props$items$items$ = props.items.items[0]) === null || _props$items$items$ === void 0 ? void 0 : _props$items$items$.x[((_props$items$items$2 = props.items.items[0]) === null || _props$items$items$2 === void 0 ? void 0 : _props$items$items$2.x.length) - 1],
        y: 0,
        showarrow: true,
        arrowhead: 0,
        xref: 'x',
        yref: 'y',
        text: `Now: ${(_props$items$items$3 = props.items.items[0]) === null || _props$items$items$3 === void 0 ? void 0 : _props$items$items$3.y[((_props$items$items$4 = props.items.items[0]) === null || _props$items$items$4 === void 0 ? void 0 : _props$items$items$4.y.length) - 1]}%`,
        ax: 0,
        ay: -160,
        borderpad: 10,
        arrowwidth: 0.7
      }],
      showlegend: false,
      xaxis: {
        fixedrange: true,
        showgrid: false,
        visible: true,
        type: 'date',
        tickformat: Object(___WEBPACK_IMPORTED_MODULE_3__["fixedIntervalToTickFormat"])(props.items.fixedInterval),
        color: '#899195'
      },
      yaxis: {
        title: {
          text: 'Error rate (%)',
          font: {
            size: 12
          },
          standoff: 10
        },
        range: [0, Math.min(100, Math.max(...(((_props$items$items$5 = props.items.items[0]) === null || _props$items$items$5 === void 0 ? void 0 : _props$items$items$5.y.map(y => y * 1.2)) || []), 1))],
        fixedrange: true,
        ticksuffix: '%',
        gridcolor: '#d9d9d9',
        showgrid: true,
        visible: true,
        color: '#899195'
      }
    };
  };

  const layout = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => getLayout(), [props.items]);

  const onClick = event => {
    if (!(event !== null && event !== void 0 && event.points)) return;
    const point = event.points[0];
    const start = point.data.x[point.pointNumber];
    const end = start + Object(___WEBPACK_IMPORTED_MODULE_3__["fixedIntervalToMilli"])(props.items.fixedInterval);
    props.setStartTime(moment__WEBPACK_IMPORTED_MODULE_1___default()(start).toISOString());
    props.setEndTime(moment__WEBPACK_IMPORTED_MODULE_1___default()(end).toISOString());
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth'
    });
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPanel"], {
    style: {
      minWidth: 433,
      minHeight: 308
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(___WEBPACK_IMPORTED_MODULE_3__["PanelTitle"], {
    title: "Trace error rate over time"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiHorizontalRule"], {
    margin: "m"
  }), ((_props$items = props.items) === null || _props$items === void 0 ? void 0 : (_props$items$items = _props$items.items) === null || _props$items$items === void 0 ? void 0 : _props$items$items.length) > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_plt__WEBPACK_IMPORTED_MODULE_4__["Plt"], {
    data: props.items.items,
    layout: layout,
    onClickHandler: onClick
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(___WEBPACK_IMPORTED_MODULE_3__["NoMatchMessage"], {
    size: "s"
  })));
}

/***/ }),

/***/ "./public/components/common/plots/latency_trend_plt.tsx":
/*!**************************************************************!*\
  !*** ./public/components/common/plots/latency_trend_plt.tsx ***!
  \**************************************************************/
/*! exports provided: LinePlt, LatencyPlt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LinePlt", function() { return LinePlt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LatencyPlt", function() { return LatencyPlt; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _plt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./plt */ "./public/components/common/plots/plt.tsx");
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



function LinePlt(props) {
  var _props$data$;

  const maxY = (_props$data$ = props.data[0]) !== null && _props$data$ !== void 0 && _props$data$.y ? Math.max(...props.data[0].y) : 0;
  const layout = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(() => ({
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    xaxis: {
      fixedrange: true,
      showgrid: false,
      visible: false
    },
    yaxis: {
      fixedrange: true,
      showgrid: false,
      visible: false,
      range: [0, maxY * 1.1]
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 0
    },
    height: 20,
    width: 60
  }), [props.data]);
  return props.data[0].x.length > 1 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_plt__WEBPACK_IMPORTED_MODULE_2__["Plt"], {
    data: props.data,
    layout: layout
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, "-");
}
function LatencyPlt(props) {
  const layout = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(() => ({
    xaxis: {
      showgrid: false,
      type: 'date',
      tickmode: 'auto',
      color: '#899195'
    },
    yaxis: {
      title: {
        text: 'Hourly latency (ms)',
        font: {
          size: 12
        }
      },
      gridcolor: '#d9d9d9',
      color: '#899195'
    },
    annotations: [{
      x: props.data[0].x[props.data[0].x.length - 1],
      y: 0,
      showarrow: true,
      arrowhead: 0,
      xref: 'x',
      yref: 'y',
      text: `Now: ${lodash__WEBPACK_IMPORTED_MODULE_0___default.a.round(props.data[0].y[props.data[0].y.length - 1], 2)}ms`,
      ax: 0,
      ay: -140,
      borderpad: 10,
      arrowwidth: 0.7
    }],
    margin: {
      l: 50,
      r: 30,
      b: 50,
      t: 30,
      pad: 0
    },
    height: 200,
    width: 400
  }), [props.data]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_plt__WEBPACK_IMPORTED_MODULE_2__["Plt"], {
    data: props.data,
    layout: layout
  }));
}

/***/ }),

/***/ "./public/components/common/plots/plt.tsx":
/*!************************************************!*\
  !*** ./public/components/common/plots/plt.tsx ***!
  \************************************************/
/*! exports provided: Plt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Plt", function() { return Plt; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_plotly_js_factory__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-plotly.js/factory */ "./node_modules/react-plotly.js/factory.js");
/* harmony import */ var react_plotly_js_factory__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_plotly_js_factory__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var plotly_js_dist__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! plotly.js-dist */ "./node_modules/plotly.js-dist/plotly.js");
/* harmony import */ var plotly_js_dist__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(plotly_js_dist__WEBPACK_IMPORTED_MODULE_2__);
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



function Plt(props) {
  const PlotComponent = react_plotly_js_factory__WEBPACK_IMPORTED_MODULE_1___default()(plotly_js_dist__WEBPACK_IMPORTED_MODULE_2___default.a);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PlotComponent, {
    data: props.data,
    style: {
      width: '100%',
      height: '100%'
    },
    onHover: props.onHoverHandler,
    onClick: props.onClickHandler,
    useResizeHandler: true,
    config: {
      displayModeBar: false
    },
    layout: {
      autosize: true,
      margin: {
        l: 30,
        r: 5,
        b: 30,
        t: 5,
        pad: 4
      },
      barmode: 'stack',
      legend: {
        orientation: 'h',
        traceorder: 'normal'
      },
      showlegend: false,
      hovermode: 'closest',
      xaxis: {
        showgrid: true,
        zeroline: false,
        rangemode: 'normal'
      },
      yaxis: {
        showgrid: true,
        zeroline: false,
        rangemode: 'normal'
      },
      ...props.layout
    }
  });
}

/***/ }),

/***/ "./public/components/common/plots/service_map.tsx":
/*!********************************************************!*\
  !*** ./public/components/common/plots/service_map.tsx ***!
  \********************************************************/
/*! exports provided: ServiceMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServiceMap", function() { return ServiceMap; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_graph_vis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-graph-vis */ "./node_modules/react-graph-vis/lib/index.js");
/* harmony import */ var react_graph_vis__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_graph_vis__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! .. */ "./public/components/common/index.ts");
/* harmony import */ var _service_map_scale__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./service_map_scale */ "./public/components/common/plots/service_map_scale.tsx");
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





function ServiceMap({
  serviceMap,
  idSelected,
  setIdSelected,
  addFilter,
  currService
}) {
  const [invalid, setInvalid] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false);
  const [network, setNetwork] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(null);
  const [ticks, setTicks] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])([]);
  const [items, setItems] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])({});
  const [query, setQuery] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])('');
  const toggleButtons = [{
    id: 'latency',
    label: 'Latency'
  }, {
    id: 'error_rate',
    label: 'Error rate'
  }, {
    id: 'throughput',
    label: 'Throughput'
  }];
  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      arrows: {
        to: {
          enabled: false
        }
      },
      physics: false
    },
    nodes: {
      shape: 'dot',
      color: '#adadad',
      borderWidth: 0,
      font: {
        size: 17,
        color: '#387ab9'
      }
    },
    interaction: {
      hover: true,
      tooltipDelay: 30,
      selectable: true
    },
    manipulation: {
      enabled: false
    },
    height: '434px',
    width: '100%',
    autoResize: true
  };
  const events = {
    select: event => {
      var _items$graph$nodes$fi;

      const {
        nodes,
        edges
      } = event;
      if (!addFilter || !nodes) return;
      const serviceName = items === null || items === void 0 ? void 0 : (_items$graph$nodes$fi = items.graph.nodes.find(node => node.id === nodes[0])) === null || _items$graph$nodes$fi === void 0 ? void 0 : _items$graph$nodes$fi.label;

      if (serviceName) {
        addFilter({
          field: 'serviceName',
          operator: 'is',
          value: serviceName,
          inverted: false,
          disabled: false
        });
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: 'smooth'
        });
      }
    },
    hoverNode: event => {}
  };

  const onFocus = (service, networkInstance) => {
    if (service.length === 0) {
      setInvalid(false);
    } else if (serviceMap[service]) {
      if (!networkInstance) networkInstance = network;
      networkInstance.focus(serviceMap[service].id, {
        animation: true
      });
      setInvalid(false);
    } else {
      setInvalid(true);
    }
  };

  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    var _serviceMap$currServi;

    if (Object.keys(serviceMap).length === 0) return;
    const values = Object.keys(serviceMap).map(service => serviceMap[service][idSelected] || null).filter(val => val !== null);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const calculatedTicks = Object(___WEBPACK_IMPORTED_MODULE_3__["calculateTicks"])(min, max);
    setTicks(calculatedTicks);
    setItems(Object(___WEBPACK_IMPORTED_MODULE_3__["getServiceMapGraph"])(serviceMap, idSelected, calculatedTicks, currService, (_serviceMap$currServi = serviceMap[currService]) === null || _serviceMap$currServi === void 0 ? void 0 : _serviceMap$currServi.relatedServices));
  }, [serviceMap, idSelected]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(___WEBPACK_IMPORTED_MODULE_3__["PanelTitle"], {
    title: "Service map"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
    size: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiButtonGroup"], {
    options: toggleButtons,
    idSelected: idSelected,
    onChange: id => setIdSelected(id),
    buttonSize: "s",
    color: "text"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiHorizontalRule"], {
    margin: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
    alignItems: "center",
    gutterSize: "s"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], null, "Focus on")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFieldSearch"], {
    placeholder: "Service name",
    value: query,
    onChange: e => setQuery(e.target.value),
    onSearch: service => onFocus(service),
    isInvalid: query.length > 0 && invalid
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], null), Object.keys(serviceMap).length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
    gutterSize: "none",
    responsive: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, (items === null || items === void 0 ? void 0 : items.graph) && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_graph_vis__WEBPACK_IMPORTED_MODULE_2___default.a, {
    graph: items.graph,
    options: options,
    events: events,
    getNetwork: networkInstance => {
      setNetwork(networkInstance);
      if (currService) onFocus(currService, networkInstance);
    }
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_service_map_scale__WEBPACK_IMPORTED_MODULE_4__["ServiceMapScale"], {
    idSelected: idSelected,
    serviceMap: serviceMap,
    ticks: ticks
  }))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    style: {
      minHeight: 434
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(___WEBPACK_IMPORTED_MODULE_3__["NoMatchMessage"], {
    size: "s"
  }))));
}

/***/ }),

/***/ "./public/components/common/plots/service_map_scale.tsx":
/*!**************************************************************!*\
  !*** ./public/components/common/plots/service_map_scale.tsx ***!
  \**************************************************************/
/*! exports provided: ServiceMapScale */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServiceMapScale", function() { return ServiceMapScale; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! .. */ "./public/components/common/index.ts");
/* harmony import */ var _plt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./plt */ "./public/components/common/plots/plt.tsx");
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




function ServiceMapScale(props) {
  const [scaleProps, setScaleProps] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])({});

  const getScaleData = () => {
    const ticks = props.ticks;
    const delta = ticks[1] - ticks[0];
    const title = {
      latency: 'Latency (ms)',
      error_rate: 'Error rate',
      throughput: 'Throughput'
    }[props.idSelected];
    const percentInterval = 1 / Math.max(ticks.length - 1, 1);
    const percents = Array.from({
      length: ticks.length - 1
    }, (v, i) => percentInterval * i);
    const color = percents.map(percent => Object(___WEBPACK_IMPORTED_MODULE_2__["getServiceMapScaleColor"])(percent, props.idSelected)).map(rgb => `rgb(${rgb})`);
    const result = {
      data: {
        y: [delta + ticks[0], ...Array.from({
          length: ticks.length - 1
        }, () => delta)],
        marker: {
          color
        }
      },
      layout: {
        yaxis: {
          range: [ticks[0], ticks[ticks.length - 1]],
          ticksuffix: props.idSelected === 'error_rate' ? '%' : '',
          title: {
            text: title,
            standoff: 15
          }
        }
      }
    };
    return result;
  };

  const getScaleProps = () => {
    const result = getScaleData();
    const data = [{
      x: Array.from({
        length: result.data.y.length
      }, () => 0),
      type: 'bar',
      orientation: 'v',
      width: 0.4,
      hoverinfo: 'none',
      showlegend: false,
      ...result.data
    }];

    const layout = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.merge({
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
      xaxis: {
        range: [-0.35, 0.35],
        fixedrange: true,
        showgrid: false,
        showline: false,
        zeroline: false,
        showticklabels: false
      },
      yaxis: {
        side: 'right',
        fixedrange: true,
        showgrid: false,
        showline: false,
        zeroline: false,
        showticklabels: true,
        tickvals: props.ticks,
        ticktexts: props.ticks
      },
      margin: {
        l: 0,
        r: 60,
        b: 10,
        t: 10,
        pad: 0
      },
      height: 270,
      width: 77
    }, result.layout);

    return {
      data,
      layout
    };
  };

  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    if (Object.keys(props.ticks).length > 0) setScaleProps(getScaleProps());
  }, [props.idSelected, props.serviceMap, props.ticks]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    style: {
      minHeight: 400,
      minWidth: 65
    }
  }, Object.keys(props.ticks).length > 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_plt__WEBPACK_IMPORTED_MODULE_3__["Plt"], scaleProps));
}

/***/ }),

/***/ "./public/components/common/plots/throughput_plt.tsx":
/*!***********************************************************!*\
  !*** ./public/components/common/plots/throughput_plt.tsx ***!
  \***********************************************************/
/*! exports provided: ThroughputPlt */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThroughputPlt", function() { return ThroughputPlt; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! .. */ "./public/components/common/index.ts");
/* harmony import */ var _plt__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./plt */ "./public/components/common/plots/plt.tsx");
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





function ThroughputPlt(props) {
  var _props$items, _props$items$items;

  const layout = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => {
    var _props$items$items$0$;

    return {
      height: 217,
      margin: {
        l: 50,
        r: 5,
        b: 50,
        t: 30,
        pad: 4
      },
      annotations: props.items.items.length > 0 && [{
        x: props.items.items[0].x[props.items.items[0].x.length - 1],
        y: 0,
        showarrow: true,
        arrowhead: 0,
        xref: 'x',
        yref: 'y',
        text: `Now: ${(_props$items$items$0$ = props.items.items[0].y[props.items.items[0].y.length - 1]) === null || _props$items$items$0$ === void 0 ? void 0 : _props$items$items$0$.toLocaleString(undefined)}`,
        ax: 0,
        ay: -160,
        borderpad: 10,
        arrowwidth: 0.7
      }],
      xaxis: {
        fixedrange: true,
        showgrid: false,
        visible: true,
        type: 'date',
        tickformat: Object(___WEBPACK_IMPORTED_MODULE_3__["fixedIntervalToTickFormat"])(props.items.fixedInterval),
        color: '#899195'
      },
      yaxis: {
        title: {
          text: 'Throughput (n)',
          font: {
            size: 12
          }
        },
        fixedrange: true,
        gridcolor: '#d9d9d9',
        showgrid: true,
        visible: true,
        color: '#899195'
      }
    };
  }, [props.items]);

  const onClick = event => {
    if (!(event !== null && event !== void 0 && event.points)) return;
    const point = event.points[0];
    const start = point.data.x[point.pointNumber];
    const end = start + Object(___WEBPACK_IMPORTED_MODULE_3__["fixedIntervalToMilli"])(props.items.fixedInterval);
    props.setStartTime(moment__WEBPACK_IMPORTED_MODULE_1___default()(start).toISOString());
    props.setEndTime(moment__WEBPACK_IMPORTED_MODULE_1___default()(end).toISOString());
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth'
    });
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPanel"], {
    style: {
      minWidth: 433,
      minHeight: 308
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(___WEBPACK_IMPORTED_MODULE_3__["PanelTitle"], {
    title: "Traces over time"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiHorizontalRule"], {
    margin: "m"
  }), ((_props$items = props.items) === null || _props$items === void 0 ? void 0 : (_props$items$items = _props$items.items) === null || _props$items$items === void 0 ? void 0 : _props$items$items.length) > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_plt__WEBPACK_IMPORTED_MODULE_4__["Plt"], {
    data: props.items.items,
    layout: layout,
    onClickHandler: onClick
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(___WEBPACK_IMPORTED_MODULE_3__["NoMatchMessage"], {
    size: "s"
  })));
}

/***/ }),

/***/ "./public/components/common/search_bar.tsx":
/*!*************************************************!*\
  !*** ./public/components/common/search_bar.tsx ***!
  \*************************************************/
/*! exports provided: renderDatePicker, SearchBar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderDatePicker", function() { return renderDatePicker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SearchBar", function() { return SearchBar; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _filters_filters__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./filters/filters */ "./public/components/common/filters/filters.tsx");
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




const renderDatePicker = (startTime, setStartTime, endTime, setEndTime) => {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSuperDatePicker"], {
    start: startTime,
    end: endTime,
    showUpdateButton: false,
    onTimeChange: e => {
      setStartTime(e.start);
      setEndTime(e.end);
    }
  });
};
function SearchBar(props) {
  // use another query state to avoid typing delay
  const [query, setQuery] = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(props.query);

  const setGlobalQuery = lodash__WEBPACK_IMPORTED_MODULE_1___default.a.debounce(q => props.setQuery(q), 50);

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
    gutterSize: "s"
  }, !props.datepickerOnly && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFieldSearch"], {
    fullWidth: true,
    isClearable: false,
    placeholder: "Trace ID, trace group name, service name",
    "data-test-subj": "search-bar-input-box",
    value: query,
    onChange: e => {
      setQuery(e.target.value);
      setGlobalQuery(e.target.value);
    },
    onSearch: props.refresh
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: false
  }, renderDatePicker(props.startTime, props.setStartTime, props.endTime, props.setEndTime)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiButton"], {
    "data-test-subj": "search-bar-refresh-button",
    fill: true,
    iconType: "refresh",
    onClick: props.refresh
  }, "Refresh"))), !props.datepickerOnly && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
    size: "s"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_filters_filters__WEBPACK_IMPORTED_MODULE_3__["Filters"], {
    page: props.page,
    filters: props.filters,
    setFilters: props.setFilters
  })));
}

/***/ }),

/***/ "./public/components/common/side_nav.tsx":
/*!***********************************************!*\
  !*** ./public/components/common/side_nav.tsx ***!
  \***********************************************/
/*! exports provided: renderPageWithSidebar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "renderPageWithSidebar", function() { return renderPageWithSidebar; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
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


const renderPageWithSidebar = (BodyComponent, activeId = 1) => {
  function SideNav({
    activeId
  }) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSideNav"], {
      items: [{
        name: 'Trace Analytics',
        id: 0,
        items: [{
          name: 'Dashboard',
          id: 1,
          href: '#/dashboard'
        }, {
          name: 'Traces',
          id: 2,
          href: '#/traces'
        }, {
          name: 'Services',
          id: 3,
          href: '#/services'
        }].map(item => {
          return { ...item,
            isSelected: activeId === item.id
          };
        })
      }]
    });
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPage"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPageSideBar"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(SideNav, {
    activeId: activeId
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPageBody"], null, BodyComponent));
};

/***/ }),

/***/ "./public/components/dashboard/dashboard.tsx":
/*!***************************************************!*\
  !*** ./public/components/dashboard/dashboard.tsx ***!
  \***************************************************/
/*! exports provided: Dashboard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dashboard", function() { return Dashboard; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _requests_dashboard_request_handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../requests/dashboard_request_handler */ "./public/requests/dashboard_request_handler.ts");
/* harmony import */ var _requests_services_request_handler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../requests/services_request_handler */ "./public/requests/services_request_handler.ts");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common */ "./public/components/common/index.ts");
/* harmony import */ var _common_filters_filter_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/filters/filter_helpers */ "./public/components/common/filters/filter_helpers.tsx");
/* harmony import */ var _common_plots_error_rate_plt__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/plots/error_rate_plt */ "./public/components/common/plots/error_rate_plt.tsx");
/* harmony import */ var _common_plots_service_map__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/plots/service_map */ "./public/components/common/plots/service_map.tsx");
/* harmony import */ var _common_plots_throughput_plt__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/plots/throughput_plt */ "./public/components/common/plots/throughput_plt.tsx");
/* harmony import */ var _dashboard_table__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dashboard_table */ "./public/components/dashboard/dashboard_table.tsx");
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










function Dashboard(props) {
  const [tableItems, setTableItems] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])([]);
  const [throughputPltItems, setThroughputPltItems] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])({
    items: [],
    fixedInterval: '1h'
  });
  const [errorRatePltItems, setErrorRatePltItems] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])({
    items: [],
    fixedInterval: '1h'
  });
  const [serviceMap, setServiceMap] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])({});
  const [serviceMapIdSelected, setServiceMapIdSelected] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])('latency');
  const [percentileMap, setPercentileMap] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])({});
  const [redirect, setRedirect] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(true);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    props.setBreadcrumbs([{
      text: 'Trace Analytics',
      href: '#'
    }, {
      text: 'Dashboard',
      href: '#/dashboard'
    }]);
    const validFilters = Object(_common_filters_filter_helpers__WEBPACK_IMPORTED_MODULE_5__["getValidFilterFields"])('dashboard');
    props.setFilters([...props.filters.map(filter => ({ ...filter,
      locked: validFilters.indexOf(filter.field) === -1
    }))]);
    setRedirect(false);
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    if (!redirect && props.indicesExist) refresh();
  }, [props.filters, props.startTime, props.endTime]);

  const refresh = async () => {
    const DSL = Object(_common__WEBPACK_IMPORTED_MODULE_4__["filtersToDsl"])(props.filters, props.query, props.startTime, props.endTime);
    const timeFilterDSL = Object(_common__WEBPACK_IMPORTED_MODULE_4__["filtersToDsl"])([], '', props.startTime, props.endTime);
    const fixedInterval = Object(_common__WEBPACK_IMPORTED_MODULE_4__["minFixedInterval"])(props.startTime, props.endTime);
    Object(_requests_dashboard_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleDashboardRequest"])(props.http, DSL, timeFilterDSL, tableItems, setTableItems, setPercentileMap);
    Object(_requests_dashboard_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleDashboardThroughputPltRequest"])(props.http, DSL, fixedInterval, throughputPltItems, setThroughputPltItems);
    Object(_requests_dashboard_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleDashboardErrorRatePltRequest"])(props.http, DSL, fixedInterval, errorRatePltItems, setErrorRatePltItems);
    Object(_requests_services_request_handler__WEBPACK_IMPORTED_MODULE_3__["handleServiceMapRequest"])(props.http, DSL, serviceMap, setServiceMap);
  };

  const addFilter = filter => {
    for (const addedFilter of props.filters) {
      if (addedFilter.field === filter.field && addedFilter.operator === filter.operator && addedFilter.value === filter.value) {
        return;
      }
    }

    const newFilters = [...props.filters, filter];
    props.setFilters(newFilters);
  };

  const addPercentileFilter = (condition = 'gte', additionalFilters = []) => {
    if (tableItems.length === 0 || Object.keys(percentileMap).length === 0) return;

    for (let i = 0; i < props.filters.length; i++) {
      if (props.filters[i].custom) {
        const newFilter = JSON.parse(JSON.stringify(props.filters[i]).replace(/{"range":{"durationInNanos":{"[gl]te?"/g, `{"range":{"durationInNanos":{"${condition}"`));
        newFilter.value = condition === 'gte' ? '>= 95th' : '< 95th';
        const newFilters = [...props.filters, ...additionalFilters];
        newFilters.splice(i, 1, newFilter);
        props.setFilters(newFilters);
        return;
      }
    }

    const percentileMaps = Object.keys(percentileMap).map(traceGroup => ({
      traceGroupName: traceGroup,
      durationFilter: {
        [condition]: Object(_common__WEBPACK_IMPORTED_MODULE_4__["milliToNanoSec"])(percentileMap[traceGroup][1])
      }
    }));
    const percentileFilter = Object(_common__WEBPACK_IMPORTED_MODULE_4__["getPercentileFilter"])(percentileMaps, condition === 'gte' ? '>= 95th' : '< 95th');
    const newFilters = [...props.filters, percentileFilter, ...additionalFilters];
    props.setFilters(newFilters);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiTitle"], {
    size: "l"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", {
    style: {
      fontWeight: 430
    }
  }, "Dashboard")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_4__["SearchBar"], {
    query: props.query,
    filters: props.filters,
    setFilters: props.setFilters,
    setQuery: props.setQuery,
    startTime: props.startTime,
    setStartTime: props.setStartTime,
    endTime: props.endTime,
    setEndTime: props.setEndTime,
    refresh: refresh,
    page: "dashboard"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
    size: "m"
  }), props.indicesExist ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_dashboard_table__WEBPACK_IMPORTED_MODULE_9__["DashboardTable"], {
    items: tableItems,
    filters: props.filters,
    addFilter: addFilter,
    addPercentileFilter: addPercentileFilter,
    setRedirect: setRedirect
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
    alignItems: "baseline"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: 4
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common_plots_service_map__WEBPACK_IMPORTED_MODULE_7__["ServiceMap"], {
    addFilter: addFilter,
    serviceMap: serviceMap,
    idSelected: serviceMapIdSelected,
    setIdSelected: setServiceMapIdSelected
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
    direction: "column"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common_plots_error_rate_plt__WEBPACK_IMPORTED_MODULE_6__["ErrorRatePlt"], {
    items: errorRatePltItems,
    setStartTime: props.setStartTime,
    setEndTime: props.setEndTime
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common_plots_throughput_plt__WEBPACK_IMPORTED_MODULE_8__["ThroughputPlt"], {
    items: throughputPltItems,
    setStartTime: props.setStartTime,
    setEndTime: props.setEndTime
  })))))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_4__["MissingConfigurationMessage"], null));
}

/***/ }),

/***/ "./public/components/dashboard/dashboard_table.tsx":
/*!*********************************************************!*\
  !*** ./public/components/dashboard/dashboard_table.tsx ***!
  \*********************************************************/
/*! exports provided: DashboardTable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardTable", function() { return DashboardTable; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ "./public/components/common/index.ts");
/* harmony import */ var _common_plots_box_plt__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/plots/box_plt */ "./public/components/common/plots/box_plt.tsx");
/* harmony import */ var _latency_trend_cell__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./latency_trend_cell */ "./public/components/dashboard/latency_trend_cell.tsx");
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






function DashboardTable(props) {
  var _props$items2;

  const getVarianceProps = items => {
    if (items.length === 0) {
      return {
        minRange: 0,
        maxRange: 0,
        ticks: [0, 0],
        scale: ''
      };
    }

    const variances = [].concat(...items.filter(item => item.dashboard_latency_variance).map(item => item.dashboard_latency_variance));
    const minRange = Math.min(...variances);
    const maxRange = Math.max(...variances);
    const ticks = Object(_common__WEBPACK_IMPORTED_MODULE_3__["calculateTicks"])(minRange, maxRange);
    const maxDigits = ticks[ticks.length - 1].toString().length; // pads spaces (\u00A0) in between ticks to construct a scale
    // width of a character equals the width of two spaces, maximum 39 characters in a scale

    const scale = ticks.map(tick => {
      const tickStr = tick.toString();
      return tickStr.padEnd(tickStr.length + 2 * (maxDigits - tickStr.length), '\u00A0');
    }).join('\u00A0'.repeat(Math.max(1, Math.floor(2 * (39 - ticks.length * maxDigits) / Math.max(1, ticks.length - 1)))));
    return {
      minRange,
      maxRange,
      ticks,
      scale
    };
  };

  const getColumns = () => [{
    field: 'dashboard_trace_group_name',
    name: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiToolTip"], {
      content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
        size: "xs"
      }, "Traces of all requests that share a common API and operation at the start of distributed tracing instrumentation.")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "Trace group name", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
      size: "s",
      color: "subdued",
      type: "questionInCircle",
      className: "eui-alignTop"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "\xA0"))),
    align: 'left',
    sortable: true,
    render: item => item ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiLink"], {
      "data-test-subj": "dashboard-table-trace-group-name-button",
      onClick: () => props.addFilter({
        field: 'traceGroup.name',
        operator: 'is',
        value: item,
        inverted: false,
        disabled: false
      })
    }, lodash__WEBPACK_IMPORTED_MODULE_1___default.a.truncate(item, {
      length: 24
    })) : '-'
  }, {
    field: 'dashboard_latency_variance',
    name: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiToolTip"], {
      content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
        size: "xs"
      }, "Range of latencies for traces within a trace group in the selected time range.")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("span", null, "Latency variance (ms)", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
      size: "s",
      color: "subdued",
      type: "questionInCircle",
      className: "eui-alignTop"
    }))), varianceProps && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "xs",
      color: "subdued"
    }, varianceProps.scale)),
    align: 'center',
    sortable: ({
      dashboard_latency_variance
    }) => (dashboard_latency_variance === null || dashboard_latency_variance === void 0 ? void 0 : dashboard_latency_variance.length) > 0 ? dashboard_latency_variance[2] - dashboard_latency_variance[0] : 0,
    width: '300px',
    render: (item, row) => {
      const filter = props.filters.find(f => f.field === 'Latency percentile within trace group');
      const currPercentileFilter = filter ? filter.value : '';
      return item ?
      /*#__PURE__*/
      // expand plot ranges to accomondate scale
      react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common_plots_box_plt__WEBPACK_IMPORTED_MODULE_4__["BoxPlt"], {
        plotParams: {
          min: varianceProps.ticks.length > 1 ? varianceProps.ticks[0] : varianceProps.ticks[0] / 1.03,
          max: varianceProps.ticks[varianceProps.ticks.length - 1] * 1.03,
          left: item[0],
          mid: item[1],
          right: item[2],
          currPercentileFilter,
          addFilter: condition => {
            const traceGroupFilter = {
              field: 'traceGroup.name',
              operator: 'is',
              value: row.dashboard_trace_group_name,
              inverted: false,
              disabled: false
            };
            const additionalFilters = [traceGroupFilter];

            for (const addedFilter of props.filters) {
              if (addedFilter.field === traceGroupFilter.field && addedFilter.operator === traceGroupFilter.operator && addedFilter.value === traceGroupFilter.value) {
                additionalFilters.pop();
              }
            }

            props.addPercentileFilter(condition, additionalFilters);
          }
        }
      }) : '-';
    }
  }, {
    field: 'dashboard_average_latency',
    name: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiToolTip"], {
      content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
        size: "xs"
      }, "Average latency of traces within a trace group in the selected time range.")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "Average latency (ms)", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
      size: "s",
      color: "subdued",
      type: "questionInCircle",
      className: "eui-alignTop"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "\xA0"))),
    align: 'right',
    sortable: true,
    dataType: 'number',
    render: item => item === 0 || item ? lodash__WEBPACK_IMPORTED_MODULE_1___default.a.round(item, 2) : '-'
  }, {
    field: '24_hour_latency_trend',
    name: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiToolTip"], {
      content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
        size: "xs"
      }, "24 hour time series view of hourly average, hourly percentile, and hourly range of latency for traces within a trace group.")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "24-hour latency trend", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
      size: "s",
      color: "subdued",
      type: "questionInCircle",
      className: "eui-alignTop"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "\xA0"))),
    align: 'right',
    sortable: false,
    render: (item, row) => item ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_latency_trend_cell__WEBPACK_IMPORTED_MODULE_5__["LatencyTrendCell"], {
      item: item,
      traceGroupName: row.dashboard_trace_group_name
    }) : '-'
  }, {
    field: 'dashboard_error_rate',
    name: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiToolTip"], {
      content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
        size: "xs"
      }, "Error rate based on count of trace errors within a trace group in the selected time range.")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "Error rate", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
      size: "s",
      color: "subdued",
      type: "questionInCircle",
      className: "eui-alignTop"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "\xA0"))),
    align: 'right',
    sortable: true,
    render: item => item === 0 || item ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s"
    }, `${lodash__WEBPACK_IMPORTED_MODULE_1___default.a.round(item, 2)}%`) : '-'
  }, {
    field: 'dashboard_traces',
    name: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiToolTip"], {
      content: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
        size: "xs"
      }, "Count of traces with unique trace identifiers in the selected time range.")
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "Traces", ' ', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiIcon"], {
      size: "s",
      color: "subdued",
      type: "questionInCircle",
      className: "eui-alignTop"
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "\xA0"))),
    align: 'right',
    sortable: true,
    render: (item, row) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiLink"], {
      "data-test-subj": "dashboard-table-traces-button",
      onClick: () => {
        props.setRedirect(true);
        props.addFilter({
          field: 'traceGroup.name',
          operator: 'is',
          value: row.dashboard_trace_group_name,
          inverted: false,
          disabled: false
        });
        location.assign('#/traces');
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiI18nNumber"], {
      value: item
    }))
  }];

  const renderTitleBar = totalItems => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      alignItems: "center",
      gutterSize: "s"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: 10
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_3__["PanelTitle"], {
      title: "Latency by trace group",
      totalItems: totalItems
    })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiLink"], {
      "data-test-subj": "dashboard-table-percentile-button-1",
      onClick: () => props.addPercentileFilter('lte')
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "xs"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("span", {
      style: {
        color: '#957ac9'
      }
    }, "\u25A1"), " < 95 percentile"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: 1
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiLink"], {
      "data-test-subj": "dashboard-table-percentile-button-2",
      onClick: () => props.addPercentileFilter('gte')
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "xs"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("span", {
      style: {
        color: '#957ac9'
      }
    }, "\u25A0"), " >= 95 percentile"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: 1
    }));
  };

  const varianceProps = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => getVarianceProps(props.items), [props.items]);
  const columns = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => getColumns(), [props.items]);
  const titleBar = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => {
    var _props$items;

    return renderTitleBar((_props$items = props.items) === null || _props$items === void 0 ? void 0 : _props$items.length);
  }, [props.items]);
  const [sorting, setSorting] = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])({
    sort: {
      field: 'dashboard_latency_variance',
      direction: 'desc'
    }
  });

  const onTableChange = async ({
    page,
    sort
  }) => {
    if (typeof (sort === null || sort === void 0 ? void 0 : sort.field) !== 'string') return;
    setSorting({
      sort
    });
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPanel"], null, titleBar, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
    size: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiHorizontalRule"], {
    margin: "none"
  }), ((_props$items2 = props.items) === null || _props$items2 === void 0 ? void 0 : _props$items2.length) > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiInMemoryTable"], {
    tableLayout: "auto",
    items: props.items,
    columns: columns,
    pagination: {
      initialPageSize: 10,
      pageSizeOptions: [5, 10, 15]
    },
    sorting: sorting,
    onTableChange: onTableChange
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_3__["NoMatchMessage"], {
    size: "xl"
  })));
}

/***/ }),

/***/ "./public/components/dashboard/index.ts":
/*!**********************************************!*\
  !*** ./public/components/dashboard/index.ts ***!
  \**********************************************/
/*! exports provided: Dashboard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dashboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dashboard */ "./public/components/dashboard/dashboard.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Dashboard", function() { return _dashboard__WEBPACK_IMPORTED_MODULE_0__["Dashboard"]; });

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


/***/ }),

/***/ "./public/components/dashboard/latency_trend_cell.tsx":
/*!************************************************************!*\
  !*** ./public/components/dashboard/latency_trend_cell.tsx ***!
  \************************************************************/
/*! exports provided: LatencyTrendCell */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LatencyTrendCell", function() { return LatencyTrendCell; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _common_plots_latency_trend_plt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/plots/latency_trend_plt */ "./public/components/common/plots/latency_trend_plt.tsx");
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



function LatencyTrendCell({
  item,
  traceGroupName
}) {
  const [isPopoverOpen, setIsPopoverOpen] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
    gutterSize: "s"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common_plots_latency_trend_plt__WEBPACK_IMPORTED_MODULE_2__["LinePlt"], {
    data: item.trendData
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPopover"], {
    ownFocus: true,
    anchorPosition: "downCenter",
    button: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiButtonIcon"], {
      "aria-label": "Open popover",
      onClick: () => setIsPopoverOpen(true),
      iconType: "magnifyWithPlus",
      size: "s"
    }),
    isOpen: isPopoverOpen,
    closePopover: () => setIsPopoverOpen(false)
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
    size: "s"
  }, "24-hour latency trend"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
    size: "s"
  }, traceGroupName)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: false
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiButtonIcon"], {
    "aria-label": "Close popover",
    iconType: "cross",
    color: "text",
    onClick: () => setIsPopoverOpen(false)
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common_plots_latency_trend_plt__WEBPACK_IMPORTED_MODULE_2__["LatencyPlt"], {
    data: item.popoverData
  }))));
}

/***/ }),

/***/ "./public/components/services/index.ts":
/*!*********************************************!*\
  !*** ./public/components/services/index.ts ***!
  \*********************************************/
/*! exports provided: Services, ServiceView, ServiceMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./services */ "./public/components/services/services.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Services", function() { return _services__WEBPACK_IMPORTED_MODULE_0__["Services"]; });

/* harmony import */ var _service_view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./service_view */ "./public/components/services/service_view.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ServiceView", function() { return _service_view__WEBPACK_IMPORTED_MODULE_1__["ServiceView"]; });

/* harmony import */ var _common_plots_service_map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/plots/service_map */ "./public/components/common/plots/service_map.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ServiceMap", function() { return _common_plots_service_map__WEBPACK_IMPORTED_MODULE_2__["ServiceMap"]; });

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




/***/ }),

/***/ "./public/components/services/service_view.tsx":
/*!*****************************************************!*\
  !*** ./public/components/services/service_view.tsx ***!
  \*****************************************************/
/*! exports provided: ServiceView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServiceView", function() { return ServiceView; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _requests_services_request_handler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../requests/services_request_handler */ "./public/requests/services_request_handler.ts");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common */ "./public/components/common/index.ts");
/* harmony import */ var _common_plots_service_map__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/plots/service_map */ "./public/components/common/plots/service_map.tsx");
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






function ServiceView(props) {
  const [fields, setFields] = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])({});
  const [serviceMap, setServiceMap] = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])({});
  const [serviceMapIdSelected, setServiceMapIdSelected] = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])('latency');
  const [redirect, setRedirect] = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])(false);
  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(() => {
    props.setBreadcrumbs([{
      text: 'Trace Analytics',
      href: '#'
    }, {
      text: 'Services',
      href: '#/services'
    }, {
      text: props.serviceName,
      href: `#/services/${encodeURIComponent(props.serviceName)}`
    }]);
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_2__["useEffect"])(() => {
    if (!redirect) refresh();
  }, [props.startTime, props.endTime]);

  const refresh = () => {
    const DSL = Object(_common__WEBPACK_IMPORTED_MODULE_4__["filtersToDsl"])(props.filters, props.query, props.startTime, props.endTime);
    Object(_requests_services_request_handler__WEBPACK_IMPORTED_MODULE_3__["handleServiceViewRequest"])(props.serviceName, props.http, DSL, fields, setFields);
    Object(_requests_services_request_handler__WEBPACK_IMPORTED_MODULE_3__["handleServiceMapRequest"])(props.http, DSL, serviceMap, setServiceMap, props.serviceName);
  };

  const renderTitle = (serviceName, startTime, setStartTime, endTime, setEndTime, addFilter) => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiTitle"], {
      size: "l"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("h2", {
      className: "overview-content"
    }, serviceName))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, Object(_common__WEBPACK_IMPORTED_MODULE_4__["renderDatePicker"])(startTime, setStartTime, endTime, setEndTime)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }));
  };

  const renderOverview = () => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_4__["PanelTitle"], {
      title: "Overview"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiHorizontalRule"], {
      margin: "m"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      direction: "column"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      className: "overview-title"
    }, "Name"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s",
      className: "overview-content"
    }, props.serviceName || '-')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      className: "overview-title"
    }, "Number of connected services"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s",
      className: "overview-content"
    }, fields.number_of_connected_services !== undefined ? fields.number_of_connected_services : 0)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      className: "overview-title"
    }, "Connected services"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s",
      className: "overview-content"
    }, fields.connected_services || '-')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      direction: "column"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      className: "overview-title"
    }, "Average latency (ms)"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s",
      className: "overview-content"
    }, fields.average_latency !== undefined ? fields.average_latency : '-')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      className: "overview-title"
    }, "Error rate"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s",
      className: "overview-content"
    }, fields.error_rate !== undefined ? lodash__WEBPACK_IMPORTED_MODULE_1___default.a.round(fields.error_rate, 2).toString() + '%' : '-')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      className: "overview-title"
    }, "Throughput"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s",
      className: "overview-content"
    }, fields.throughput !== undefined ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiI18nNumber"], {
      value: fields.throughput
    }) : '-')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      className: "overview-title"
    }, "Traces"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s",
      className: "overview-content"
    }, fields.traces !== undefined ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiI18nNumber"], {
      value: fields.traces
    }) : '-'))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], null));
  };

  const overview = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => renderOverview(), [fields, props.serviceName]);
  const title = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => renderTitle(props.serviceName, props.startTime, props.setStartTime, props.endTime, props.setEndTime, props.addFilter), [props.serviceName, props.startTime, props.endTime]);
  const activeFilters = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => props.filters.filter(filter => !filter.locked && !filter.disabled), [props.filters]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPage"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPageBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
    alignItems: "center",
    gutterSize: "s"
  }, title), activeFilters.length > 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
    textAlign: "right",
    style: {
      marginRight: 20
    },
    color: "subdued"
  }, "results are filtered by ", activeFilters.map(filter => filter.field).join(', ')), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
    size: "xl"
  }), overview, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common_plots_service_map__WEBPACK_IMPORTED_MODULE_5__["ServiceMap"], {
    serviceMap: serviceMap,
    idSelected: serviceMapIdSelected,
    setIdSelected: setServiceMapIdSelected,
    currService: props.serviceName
  }))));
}

/***/ }),

/***/ "./public/components/services/services.tsx":
/*!*************************************************!*\
  !*** ./public/components/services/services.tsx ***!
  \*************************************************/
/*! exports provided: Services */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Services", function() { return Services; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _requests_services_request_handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../requests/services_request_handler */ "./public/requests/services_request_handler.ts");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ "./public/components/common/index.ts");
/* harmony import */ var _common_filters_filter_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/filters/filter_helpers */ "./public/components/common/filters/filter_helpers.tsx");
/* harmony import */ var _services_table__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services_table */ "./public/components/services/services_table.tsx");
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






function Services(props) {
  const [serviceMap, setServiceMap] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])({});
  const [serviceMapIdSelected, setServiceMapIdSelected] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])('latency');
  const [tableItems, setTableItems] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])([]);
  const [redirect, setRedirect] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(true);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    props.setBreadcrumbs([{
      text: 'Trace Analytics',
      href: '#'
    }, {
      text: 'Services',
      href: '#/services'
    }]);
    const validFilters = Object(_common_filters_filter_helpers__WEBPACK_IMPORTED_MODULE_4__["getValidFilterFields"])('services');
    props.setFilters([...props.filters.map(filter => ({ ...filter,
      locked: validFilters.indexOf(filter.field) === -1
    }))]);
    setRedirect(false);
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    if (!redirect && props.indicesExist) refresh();
  }, [props.filters]);

  const refresh = () => {
    const DSL = Object(_common__WEBPACK_IMPORTED_MODULE_3__["filtersToDsl"])(props.filters, props.query, props.startTime, props.endTime);
    Object(_requests_services_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleServicesRequest"])(props.http, DSL, tableItems, setTableItems, setServiceMap, serviceQuery);
  };

  const addFilter = filter => {
    for (const addedFilter of props.filters) {
      if (addedFilter.field === filter.field && addedFilter.operator === filter.operator && addedFilter.value === filter.value) {
        return;
      }
    }

    const newFilters = [...props.filters, filter];
    props.setFilters(newFilters);
  };

  const [serviceQuery, setServiceQuery] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])('');
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiTitle"], {
    size: "l"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", {
    style: {
      fontWeight: 430
    }
  }, "Services")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_3__["SearchBar"], {
    query: props.query,
    filters: props.filters,
    setFilters: props.setFilters,
    setQuery: props.setQuery,
    startTime: props.startTime,
    setStartTime: props.setStartTime,
    endTime: props.endTime,
    setEndTime: props.setEndTime,
    refresh: refresh,
    page: "services"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_services_table__WEBPACK_IMPORTED_MODULE_5__["ServicesTable"], {
    items: tableItems,
    addFilter: addFilter,
    setRedirect: setRedirect,
    serviceQuery: serviceQuery,
    setServiceQuery: setServiceQuery,
    refresh: refresh,
    indicesExist: props.indicesExist
  }));
}

/***/ }),

/***/ "./public/components/services/services_table.tsx":
/*!*******************************************************!*\
  !*** ./public/components/services/services_table.tsx ***!
  \*******************************************************/
/*! exports provided: ServicesTable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServicesTable", function() { return ServicesTable; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ "./public/components/common/index.ts");
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




function ServicesTable(props) {
  var _props$items2;

  const renderTitleBar = totalItems => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      alignItems: "center",
      gutterSize: "s"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: 10
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_3__["PanelTitle"], {
      title: "Services",
      totalItems: totalItems
    })));
  };

  const columns = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => [{
    field: 'name',
    name: 'Name',
    align: 'left',
    sortable: true,
    render: item => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiLink"], {
      href: `#/services/${encodeURIComponent(item)}`
    }, lodash__WEBPACK_IMPORTED_MODULE_1___default.a.truncate(item, {
      length: 24
    }))
  }, {
    field: 'average_latency',
    name: 'Average latency (ms)',
    align: 'right',
    sortable: true,
    render: item => item === 0 || item ? lodash__WEBPACK_IMPORTED_MODULE_1___default.a.round(item, 2) : '-'
  }, {
    field: 'error_rate',
    name: 'Error rate',
    align: 'right',
    sortable: true,
    render: item => item === 0 || item ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s"
    }, `${lodash__WEBPACK_IMPORTED_MODULE_1___default.a.round(item, 2)}%`) : '-'
  }, {
    field: 'throughput',
    name: 'Throughput',
    align: 'right',
    sortable: true,
    truncateText: true,
    render: item => item === 0 || item ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiI18nNumber"], {
      value: item
    }) : '-'
  }, {
    field: 'number_of_connected_services',
    name: 'No. of connected services',
    align: 'right',
    sortable: true,
    truncateText: true,
    width: '80px',
    render: item => item === 0 || item ? item : '-'
  }, {
    field: 'connected_services',
    name: 'Connected services',
    align: 'left',
    sortable: true,
    truncateText: true,
    render: item => item ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s"
    }, lodash__WEBPACK_IMPORTED_MODULE_1___default.a.truncate(item, {
      length: 50
    })) : '-'
  }, {
    field: 'traces',
    name: 'Traces',
    align: 'right',
    sortable: true,
    truncateText: true,
    render: (item, row) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, item === 0 || item ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiLink"], {
      onClick: () => {
        props.setRedirect(true);
        props.addFilter({
          field: 'serviceName',
          operator: 'is',
          value: row.name,
          inverted: false,
          disabled: false
        });
        location.assign('#/traces');
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiI18nNumber"], {
      value: item
    })) : '-')
  }], [props.items]);
  const titleBar = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => {
    var _props$items;

    return renderTitleBar((_props$items = props.items) === null || _props$items === void 0 ? void 0 : _props$items.length);
  }, [props.items]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPanel"], null, titleBar, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
    size: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiHorizontalRule"], {
    margin: "none"
  }), ((_props$items2 = props.items) === null || _props$items2 === void 0 ? void 0 : _props$items2.length) > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiInMemoryTable"], {
    tableLayout: "auto",
    items: props.items,
    columns: columns,
    pagination: {
      initialPageSize: 10,
      pageSizeOptions: [5, 10, 15]
    },
    sorting: {
      sort: {
        field: 'name',
        direction: 'asc'
      }
    }
  }) : props.indicesExist ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_3__["NoMatchMessage"], {
    size: "xl"
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_3__["MissingConfigurationMessage"], null)));
}

/***/ }),

/***/ "./public/components/traces/index.ts":
/*!*******************************************!*\
  !*** ./public/components/traces/index.ts ***!
  \*******************************************/
/*! exports provided: Traces, TraceView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _traces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./traces */ "./public/components/traces/traces.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Traces", function() { return _traces__WEBPACK_IMPORTED_MODULE_0__["Traces"]; });

/* harmony import */ var _trace_view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./trace_view */ "./public/components/traces/trace_view.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TraceView", function() { return _trace_view__WEBPACK_IMPORTED_MODULE_1__["TraceView"]; });

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



/***/ }),

/***/ "./public/components/traces/service_breakdown_panel.tsx":
/*!**************************************************************!*\
  !*** ./public/components/traces/service_breakdown_panel.tsx ***!
  \**************************************************************/
/*! exports provided: ServiceBreakdownPanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServiceBreakdownPanel", function() { return ServiceBreakdownPanel; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ "./public/components/common/index.ts");
/* harmony import */ var _common_plots_plt__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/plots/plt */ "./public/components/common/plots/plt.tsx");
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





function ServiceBreakdownPanel(props) {
  var _props$data;

  const layout = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => ({
    height: 200,
    width: 200,
    showlegend: false,
    margin: {
      l: 5,
      r: 5,
      b: 5,
      t: 5
    }
  }), [props.data]);

  const renderStats = () => {
    return props.data.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      responsive: false,
      style: {
        maxHeight: 260,
        overflowY: 'auto'
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      direction: "column",
      alignItems: "flexStart",
      gutterSize: "m",
      responsive: false
    }, props.data[0].marker.colors.map((color, i) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      key: `label-${i}`
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiHealth"], {
      color: color
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", {
      style: {
        whiteSpace: 'nowrap'
      }
    }, props.data[0].labels[i])))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      direction: "column",
      alignItems: "flexEnd",
      gutterSize: "m",
      responsive: false
    }, props.data[0].values.map((value, i) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      key: `value-${i}`
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s"
    }, lodash__WEBPACK_IMPORTED_MODULE_1___default.a.round(value, 2), "%")))))) : null;
  };

  const stats = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => renderStats(), [props.data]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_3__["PanelTitle"], {
    title: "Time spent by service"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiHorizontalRule"], {
    margin: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
    direction: "column",
    alignItems: "center"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, ((_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.length) > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common_plots_plt__WEBPACK_IMPORTED_MODULE_4__["Plt"], {
    data: props.data,
    layout: layout
  }) : null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, stats)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], null)));
}

/***/ }),

/***/ "./public/components/traces/span_detail_panel.tsx":
/*!********************************************************!*\
  !*** ./public/components/traces/span_detail_panel.tsx ***!
  \********************************************************/
/*! exports provided: SpanDetailPanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpanDetailPanel", function() { return SpanDetailPanel; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common */ "./public/components/common/index.ts");
/* harmony import */ var _common_plots_plt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/plots/plt */ "./public/components/common/plots/plt.tsx");
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




function SpanDetailPanel(props) {
  const getSpanDetailLayout = (plotTraces, maxX) => {
    // get unique labels from traces
    const yLabels = plotTraces.map(d => d.y[0]).filter((label, i, self) => self.indexOf(label) === i); // remove uuid when displaying y-ticks

    const yTexts = yLabels.map(label => label.substring(0, label.length - 36));
    return {
      height: 25 * plotTraces.length + 60,
      width: 800,
      margin: {
        l: 260,
        r: 5,
        b: 30,
        t: 30
      },
      xaxis: {
        ticksuffix: ' ms',
        side: 'top',
        color: '#91989c',
        showline: true,
        range: [0, maxX * 1.2]
      },
      yaxis: {
        showgrid: false,
        tickvals: yLabels,
        ticktext: yTexts
      }
    };
  };

  const layout = Object(react__WEBPACK_IMPORTED_MODULE_1__["useMemo"])(() => getSpanDetailLayout(props.data.gantt, props.data.ganttMaxX), [props.data.gantt, props.data.ganttMaxX]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_2__["PanelTitle"], {
    title: "Span detail"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiHorizontalRule"], {
    margin: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    style: {
      overflowY: 'auto',
      maxHeight: 500
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common_plots_plt__WEBPACK_IMPORTED_MODULE_3__["Plt"], {
    data: props.data.gantt,
    layout: layout
  }))));
}

/***/ }),

/***/ "./public/components/traces/trace_view.tsx":
/*!*************************************************!*\
  !*** ./public/components/traces/trace_view.tsx ***!
  \*************************************************/
/*! exports provided: TraceView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TraceView", function() { return TraceView; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _requests_traces_request_handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../requests/traces_request_handler */ "./public/requests/traces_request_handler.ts");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ "./public/components/common/index.ts");
/* harmony import */ var _service_breakdown_panel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./service_breakdown_panel */ "./public/components/traces/service_breakdown_panel.tsx");
/* harmony import */ var _span_detail_panel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./span_detail_panel */ "./public/components/traces/span_detail_panel.tsx");
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






function TraceView(props) {
  const renderTitle = traceId => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiTitle"], {
      size: "l"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", {
      className: "overview-content"
    }, traceId))));
  };

  const renderOverview = fields => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_3__["PanelTitle"], {
      title: "Overview"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiHorizontalRule"], {
      margin: "m"
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      direction: "column"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      className: "overview-title"
    }, "Trace ID"), fields.trace_id && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      gutterSize: "s",
      alignItems: "center"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s",
      className: "overview-content"
    }, fields.trace_id)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiCopy"], {
      textToCopy: fields.trace_id
    }, copy => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiButtonIcon"], {
      "aria-label": "Copy trace id",
      iconType: "copyClipboard",
      onClick: copy
    }, "Click to copy"))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      className: "overview-title"
    }, "Trace group name"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s",
      className: "overview-content"
    }, fields.trace_group)))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      direction: "column"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      className: "overview-title"
    }, "Latency"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s",
      className: "overview-content"
    }, fields.latency)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      className: "overview-title"
    }, "Last updated"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s",
      className: "overview-content"
    }, fields.last_updated)))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      direction: "column"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      className: "overview-title"
    }, "Errors"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s",
      className: "overview-content"
    }, fields.error_count))))));
  };

  const [fields, setFields] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])({});
  const [serviceBreakdownData, setServiceBreakdownData] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])([]);
  const [spanDetailData, setSpanDetailData] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])({
    gantt: [],
    table: [],
    ganttMaxX: 0
  });
  const [payloadData, setPayloadData] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])('');
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    props.setBreadcrumbs([{
      text: 'Trace Analytics',
      href: '#'
    }, {
      text: 'Traces',
      href: '#/traces'
    }, {
      text: props.traceId,
      href: `#/traces/${encodeURIComponent(props.traceId)}`
    }]);
    refresh();
  }, []);

  const refresh = () => {
    Object(_requests_traces_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleTraceViewRequest"])(props.traceId, props.http, fields, setFields);
    Object(_requests_traces_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleTracesChartsRequest"])(props.traceId, props.http, serviceBreakdownData, setServiceBreakdownData, spanDetailData, setSpanDetailData);
    Object(_requests_traces_request_handler__WEBPACK_IMPORTED_MODULE_2__["handlePayloadRequest"])(props.traceId, props.http, payloadData, setPayloadData);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPage"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPageBody"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
    alignItems: "center",
    gutterSize: "s"
  }, renderTitle(props.traceId)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
    size: "xl"
  }), renderOverview(fields), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: 3
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_service_breakdown_panel__WEBPACK_IMPORTED_MODULE_4__["ServiceBreakdownPanel"], {
    data: serviceBreakdownData
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
    grow: 7
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_span_detail_panel__WEBPACK_IMPORTED_MODULE_5__["SpanDetailPanel"], {
    data: spanDetailData
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPanel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_3__["PanelTitle"], {
    title: "Payload"
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiHorizontalRule"], {
    margin: "m"
  }), payloadData.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiCodeBlock"], {
    language: "json",
    paddingSize: "s",
    isCopyable: true,
    overflowHeight: 500
  }, payloadData) : null))));
}

/***/ }),

/***/ "./public/components/traces/traces.tsx":
/*!*********************************************!*\
  !*** ./public/components/traces/traces.tsx ***!
  \*********************************************/
/*! exports provided: Traces */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Traces", function() { return Traces; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _requests_traces_request_handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../requests/traces_request_handler */ "./public/requests/traces_request_handler.ts");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ "./public/components/common/index.ts");
/* harmony import */ var _common_filters_filter_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/filters/filter_helpers */ "./public/components/common/filters/filter_helpers.tsx");
/* harmony import */ var _traces_table__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./traces_table */ "./public/components/traces/traces_table.tsx");
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






function Traces(props) {
  const [tableItems, setTableItems] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])([]);
  const [redirect, setRedirect] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(true);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    props.setBreadcrumbs([{
      text: 'Trace Analytics',
      href: '#'
    }, {
      text: 'Traces',
      href: '#/traces'
    }]);
    const validFilters = Object(_common_filters_filter_helpers__WEBPACK_IMPORTED_MODULE_4__["getValidFilterFields"])('traces');
    props.setFilters([...props.filters.map(filter => ({ ...filter,
      locked: validFilters.indexOf(filter.field) === -1
    }))]);
    setRedirect(false);
  }, []);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    if (!redirect && props.indicesExist) refresh();
  }, [props.filters]);

  const refresh = async sort => {
    const DSL = Object(_common__WEBPACK_IMPORTED_MODULE_3__["filtersToDsl"])(props.filters, props.query, props.startTime, props.endTime);
    const timeFilterDSL = Object(_common__WEBPACK_IMPORTED_MODULE_3__["filtersToDsl"])([], '', props.startTime, props.endTime);
    await Object(_requests_traces_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleTracesRequest"])(props.http, DSL, timeFilterDSL, tableItems, setTableItems, sort);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiTitle"], {
    size: "l"
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", {
    style: {
      fontWeight: 430
    }
  }, "Traces")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_3__["SearchBar"], {
    query: props.query,
    filters: props.filters,
    setFilters: props.setFilters,
    setQuery: props.setQuery,
    startTime: props.startTime,
    setStartTime: props.setStartTime,
    endTime: props.endTime,
    setEndTime: props.setEndTime,
    refresh: refresh,
    page: "traces"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
    size: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_traces_table__WEBPACK_IMPORTED_MODULE_5__["TracesTable"], {
    items: tableItems,
    refresh: refresh,
    indicesExist: props.indicesExist
  }));
}

/***/ }),

/***/ "./public/components/traces/traces_table.tsx":
/*!***************************************************!*\
  !*** ./public/components/traces/traces_table.tsx ***!
  \***************************************************/
/*! exports provided: TracesTable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TracesTable", function() { return TracesTable; });
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/eui */ "@elastic/eui");
/* harmony import */ var _elastic_eui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../common */ "./common/index.ts");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common */ "./public/components/common/index.ts");
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





function TracesTable(props) {
  var _props$items3;

  const renderTitleBar = totalItems => {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      alignItems: "center",
      gutterSize: "s"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: 10
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_4__["PanelTitle"], {
      title: "Traces",
      totalItems: totalItems
    })));
  };

  const columns = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => [{
    field: 'trace_id',
    name: 'Trace ID',
    align: 'left',
    sortable: true,
    truncateText: true,
    render: item => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexGroup"], {
      gutterSize: "s",
      alignItems: "center"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: 10
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiLink"], {
      href: `#/traces/${encodeURIComponent(item)}`
    }, lodash__WEBPACK_IMPORTED_MODULE_1___default.a.truncate(item, {
      length: 24
    }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: false
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiCopy"], {
      textToCopy: item
    }, copy => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiButtonIcon"], {
      "aria-label": "Copy trace id",
      iconType: "copyClipboard",
      onClick: copy
    }, "Click to copy"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiFlexItem"], {
      grow: 3
    }))
  }, {
    field: 'trace_group',
    name: 'Trace group',
    align: 'left',
    sortable: true,
    truncateText: true,
    render: item => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s"
    }, lodash__WEBPACK_IMPORTED_MODULE_1___default.a.truncate(item, {
      length: 24
    }))
  }, {
    field: 'latency',
    name: 'Latency (ms)',
    align: 'right',
    sortable: true,
    truncateText: true
  }, {
    field: 'percentile_in_trace_group',
    name: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement("div", null, "Percentile in trace group")),
    align: 'right',
    sortable: true,
    render: item => item === 0 || item ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiText"], {
      size: "s"
    }, `${lodash__WEBPACK_IMPORTED_MODULE_1___default.a.round(item, 2)}th`) : '-'
  }, {
    field: 'error_count',
    name: 'Errors',
    align: 'right',
    sortable: true,
    render: item => item === 0 || item ? item : '-'
  }, {
    field: 'last_updated',
    name: 'Last updated',
    align: 'left',
    sortable: true,
    render: item => item === 0 || item ? item : '-'
  }], [props.items]);
  const titleBar = Object(react__WEBPACK_IMPORTED_MODULE_2__["useMemo"])(() => {
    var _props$items;

    return renderTitleBar((_props$items = props.items) === null || _props$items === void 0 ? void 0 : _props$items.length);
  }, [props.items]);
  const [sorting, setSorting] = Object(react__WEBPACK_IMPORTED_MODULE_2__["useState"])({
    sort: {
      field: 'trace_id',
      direction: 'asc'
    }
  });

  const onTableChange = async ({
    page,
    sort
  }) => {
    var _props$items2;

    if (typeof (sort === null || sort === void 0 ? void 0 : sort.field) !== 'string') return; // maps table column key to DSL aggregation name

    const field = {
      trace_id: '_key',
      trace_group: null,
      latency: 'latency',
      percentile_in_trace_group: null,
      error_count: 'error_count',
      last_updated: 'last_updated'
    }[sort.field];

    if (!field || ((_props$items2 = props.items) === null || _props$items2 === void 0 ? void 0 : _props$items2.length) < _common__WEBPACK_IMPORTED_MODULE_3__["TRACES_MAX_NUM"]) {
      setSorting({
        sort
      });
      return;
    } // using await when sorting the default sorted field leads to a bug in UI


    if (sort.field === 'trace_id') {
      props.refresh({ ...sort,
        field
      });
      setSorting({
        sort
      });
      return;
    }

    await props.refresh({ ...sort,
      field
    });
    setSorting({
      sort
    });
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_2___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiPanel"], null, titleBar, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiSpacer"], {
    size: "m"
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiHorizontalRule"], {
    margin: "none"
  }), ((_props$items3 = props.items) === null || _props$items3 === void 0 ? void 0 : _props$items3.length) > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_elastic_eui__WEBPACK_IMPORTED_MODULE_0__["EuiInMemoryTable"], {
    tableLayout: "auto",
    items: props.items,
    columns: columns,
    pagination: {
      initialPageSize: 10,
      pageSizeOptions: [5, 10, 15]
    },
    sorting: sorting,
    onTableChange: onTableChange
  }) : props.indicesExist ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_4__["NoMatchMessage"], {
    size: "xl"
  }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement(_common__WEBPACK_IMPORTED_MODULE_4__["MissingConfigurationMessage"], null)));
}

/***/ }),

/***/ "./public/requests/dashboard_request_handler.ts":
/*!******************************************************!*\
  !*** ./public/requests/dashboard_request_handler.ts ***!
  \******************************************************/
/*! exports provided: handleDashboardRequest, handleDashboardThroughputPltRequest, handleDashboardErrorRatePltRequest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleDashboardRequest", function() { return handleDashboardRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleDashboardThroughputPltRequest", function() { return handleDashboardThroughputPltRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleDashboardErrorRatePltRequest", function() { return handleDashboardErrorRatePltRequest; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common */ "./common/index.ts");
/* harmony import */ var _components_common_helper_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/common/helper_functions */ "./public/components/common/helper_functions.tsx");
/* harmony import */ var _queries_dashboard_queries__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./queries/dashboard_queries */ "./public/requests/queries/dashboard_queries.ts");
/* harmony import */ var _request_handler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./request_handler */ "./public/requests/request_handler.ts");
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






const handleDashboardRequest = async (http, DSL, timeFilterDSL, items, setItems, setPercentileMap) => {
  // latency_variance should only be affected by timefilter
  const latencyVariances = await Object(_request_handler__WEBPACK_IMPORTED_MODULE_5__["handleDslRequest"])(http, timeFilterDSL, Object(_queries_dashboard_queries__WEBPACK_IMPORTED_MODULE_4__["getDashboardTraceGroupPercentiles"])()).then(response => {
    const map = {};
    response.aggregations.trace_group.buckets.forEach(traceGroup => {
      map[traceGroup.key] = Object.values(traceGroup.latency_variance_nanos.values).map(nano => lodash__WEBPACK_IMPORTED_MODULE_0___default.a.round(Object(_components_common_helper_functions__WEBPACK_IMPORTED_MODULE_3__["nanoToMilliSec"])(Math.max(0, nano)), 2));
    });
    return map;
  }).catch(error => console.error(error));
  if (setPercentileMap) setPercentileMap(latencyVariances);
  Object(_request_handler__WEBPACK_IMPORTED_MODULE_5__["handleDslRequest"])(http, DSL, Object(_queries_dashboard_queries__WEBPACK_IMPORTED_MODULE_4__["getDashboardQuery"])()).then(response => {
    return Promise.all(response.aggregations.trace_group_name.buckets.map(bucket => {
      var _values$x;

      const latencyTrend = bucket.group_by_hour.buckets.slice(-24).filter(bucket => {
        var _bucket$average_laten, _bucket$average_laten2;

        return ((_bucket$average_laten = bucket.average_latency) === null || _bucket$average_laten === void 0 ? void 0 : _bucket$average_laten.value) || ((_bucket$average_laten2 = bucket.average_latency) === null || _bucket$average_laten2 === void 0 ? void 0 : _bucket$average_laten2.value) === 0;
      });
      const values = {
        x: latencyTrend.map(bucket => bucket.key),
        y: latencyTrend.map(bucket => {
          var _bucket$average_laten3;

          return ((_bucket$average_laten3 = bucket.average_latency) === null || _bucket$average_laten3 === void 0 ? void 0 : _bucket$average_laten3.value) || 0;
        })
      };
      const latencyTrendData = ((_values$x = values.x) === null || _values$x === void 0 ? void 0 : _values$x.length) > 0 ? {
        '24_hour_latency_trend': {
          trendData: [{ ...values,
            type: 'scatter',
            mode: 'lines',
            hoverinfo: 'none',
            line: {
              color: '#000000',
              width: 1
            }
          }],
          popoverData: [{ ...values,
            type: 'scatter',
            mode: 'lines+markers',
            hovertemplate: '%{x}<br>Average latency: %{y}<extra></extra>',
            hoverlabel: {
              bgcolor: '#d7c2ff'
            },
            marker: {
              color: '#987dcb',
              size: 8
            },
            line: {
              color: '#987dcb',
              size: 2
            }
          }]
        }
      } : {};
      return {
        dashboard_trace_group_name: bucket.key,
        dashboard_average_latency: bucket.average_latency.value,
        dashboard_traces: bucket.trace_count.value,
        dashboard_latency_variance: latencyVariances[bucket.key],
        dashboard_error_rate: bucket.error_rate.value,
        ...latencyTrendData
      };
    }));
  }).then(newItems => {
    setItems(newItems);
  }).catch(error => console.error(error));
};
const handleDashboardThroughputPltRequest = (http, DSL, fixedInterval, items, setItems) => {
  Object(_request_handler__WEBPACK_IMPORTED_MODULE_5__["handleDslRequest"])(http, DSL, Object(_queries_dashboard_queries__WEBPACK_IMPORTED_MODULE_4__["getDashboardThroughputPltQuery"])(fixedInterval)).then(response => {
    const buckets = response.aggregations.throughput.buckets;
    const texts = buckets.map(bucket => `${moment__WEBPACK_IMPORTED_MODULE_1___default()(bucket.key).format(_common__WEBPACK_IMPORTED_MODULE_2__["DATE_PICKER_FORMAT"])} - ${moment__WEBPACK_IMPORTED_MODULE_1___default()(bucket.key + Object(_components_common_helper_functions__WEBPACK_IMPORTED_MODULE_3__["fixedIntervalToMilli"])(fixedInterval)).format(_common__WEBPACK_IMPORTED_MODULE_2__["DATE_PICKER_FORMAT"])}`);
    const newItems = buckets.length > 0 ? [{
      x: buckets.map(bucket => bucket.key),
      y: buckets.map(bucket => bucket.trace_count.value),
      marker: {
        color: 'rgb(171, 211, 240)'
      },
      type: 'bar',
      text: texts,
      hoverlabel: {
        align: 'left'
      },
      hovertemplate: '%{text}<br>Throughput: %{y:,}<extra></extra>'
    }] : [];
    setItems({
      items: newItems,
      fixedInterval: fixedInterval
    });
  }).catch(error => console.error(error));
};
const handleDashboardErrorRatePltRequest = (http, DSL, fixedInterval, items, setItems) => {
  Object(_request_handler__WEBPACK_IMPORTED_MODULE_5__["handleDslRequest"])(http, DSL, Object(_queries_dashboard_queries__WEBPACK_IMPORTED_MODULE_4__["getErrorRatePltQuery"])(fixedInterval)).then(response => {
    const buckets = response.aggregations.error_rate.buckets;
    const texts = buckets.map(bucket => `${moment__WEBPACK_IMPORTED_MODULE_1___default()(bucket.key).format(_common__WEBPACK_IMPORTED_MODULE_2__["DATE_PICKER_FORMAT"])} - ${moment__WEBPACK_IMPORTED_MODULE_1___default()(bucket.key + Object(_components_common_helper_functions__WEBPACK_IMPORTED_MODULE_3__["fixedIntervalToMilli"])(fixedInterval)).format(_common__WEBPACK_IMPORTED_MODULE_2__["DATE_PICKER_FORMAT"])}`);
    const newItems = buckets.length > 0 ? [{
      x: buckets.map(bucket => bucket.key),
      y: buckets.map(bucket => {
        var _bucket$error_rate;

        return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.round(((_bucket$error_rate = bucket.error_rate) === null || _bucket$error_rate === void 0 ? void 0 : _bucket$error_rate.value) || 0, 2);
      }),
      marker: {
        color: '#fad963'
      },
      type: 'bar',
      text: texts,
      hoverlabel: {
        align: 'left'
      },
      hovertemplate: '%{text}<br>Error rate: %{y}<extra></extra>'
    }] : [];
    setItems({
      items: newItems,
      fixedInterval: fixedInterval
    });
  }).catch(error => console.error(error));
};

/***/ }),

/***/ "./public/requests/queries/dashboard_queries.ts":
/*!******************************************************!*\
  !*** ./public/requests/queries/dashboard_queries.ts ***!
  \******************************************************/
/*! exports provided: getDashboardQuery, getDashboardTraceGroupPercentiles, getErrorRatePltQuery, getDashboardThroughputPltQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDashboardQuery", function() { return getDashboardQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDashboardTraceGroupPercentiles", function() { return getDashboardTraceGroupPercentiles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getErrorRatePltQuery", function() { return getErrorRatePltQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDashboardThroughputPltQuery", function() { return getDashboardThroughputPltQuery; });
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
const getDashboardQuery = () => {
  const query = {
    size: 0,
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
        must_not: []
      }
    },
    aggs: {
      trace_group_name: {
        terms: {
          field: 'traceGroup.name',
          size: 10000
        },
        aggs: {
          group_by_hour: {
            date_histogram: {
              field: 'endTime',
              calendar_interval: 'hour'
            },
            aggs: {
              traces: {
                terms: {
                  field: 'traceId',
                  order: {
                    last_updated: 'desc'
                  },
                  size: 10000
                },
                aggs: {
                  duration: {
                    max: {
                      field: 'traceGroup.durationInNanos'
                    }
                  },
                  last_updated: {
                    max: {
                      field: 'traceGroup.endTime'
                    }
                  }
                }
              },
              average_latency_nanos: {
                avg_bucket: {
                  buckets_path: 'traces>duration'
                }
              },
              average_latency: {
                bucket_script: {
                  buckets_path: {
                    count: '_count',
                    latency: 'average_latency_nanos.value'
                  },
                  script: 'Math.round(params.latency / 10000) / 100.0'
                }
              }
            }
          },
          traces: {
            terms: {
              field: 'traceId',
              order: {
                last_updated: 'desc'
              },
              size: 10000
            },
            aggs: {
              duration: {
                max: {
                  field: 'traceGroup.durationInNanos'
                }
              },
              last_updated: {
                max: {
                  field: 'traceGroup.endTime'
                }
              }
            }
          },
          average_latency_nanos: {
            avg_bucket: {
              buckets_path: 'traces>duration'
            }
          },
          average_latency: {
            bucket_script: {
              buckets_path: {
                count: '_count',
                latency: 'average_latency_nanos.value'
              },
              script: 'Math.round(params.latency / 10000) / 100.0'
            }
          },
          trace_count: {
            cardinality: {
              field: 'traceId'
            }
          },
          error_count: {
            filter: {
              term: {
                'traceGroup.statusCode': '2'
              }
            },
            aggs: {
              trace_count: {
                cardinality: {
                  field: 'traceId'
                }
              }
            }
          },
          error_rate: {
            bucket_script: {
              buckets_path: {
                total: 'trace_count.value',
                errors: 'error_count>trace_count.value'
              },
              script: 'params.errors / params.total * 100'
            }
          }
        }
      }
    }
  };
  return query;
};
const getDashboardTraceGroupPercentiles = () => {
  return {
    size: 0,
    query: {
      bool: {
        must: [{
          term: {
            parentSpanId: {
              value: ''
            }
          }
        }],
        filter: [],
        should: [],
        must_not: []
      }
    },
    aggs: {
      trace_group: {
        terms: {
          field: 'traceGroup.name'
        },
        aggs: {
          latency_variance_nanos: {
            percentiles: {
              field: 'traceGroup.durationInNanos',
              percents: [0, 95, 100]
            }
          }
        }
      }
    }
  };
};
const getErrorRatePltQuery = fixedInterval => {
  const query = {
    size: 0,
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
        must_not: []
      }
    },
    aggs: {
      error_rate: {
        date_histogram: {
          field: 'startTime',
          fixed_interval: fixedInterval
        },
        aggs: {
          error_count: {
            filter: {
              term: {
                'traceGroup.statusCode': '2'
              }
            },
            aggs: {
              trace_count: {
                cardinality: {
                  field: 'traceId'
                }
              }
            }
          },
          trace_count: {
            cardinality: {
              field: 'traceId'
            }
          },
          error_rate: {
            bucket_script: {
              buckets_path: {
                total: 'trace_count.value',
                errors: 'error_count>trace_count.value'
              },
              script: 'params.errors / params.total * 100'
            }
          }
        }
      }
    }
  };
  return query;
};
const getDashboardThroughputPltQuery = fixedInterval => {
  const query = {
    size: 0,
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
        must_not: []
      }
    },
    aggs: {
      throughput: {
        date_histogram: {
          field: 'startTime',
          fixed_interval: fixedInterval
        },
        aggs: {
          trace_count: {
            cardinality: {
              field: 'traceId'
            }
          }
        }
      }
    }
  };
  return query;
};

/***/ }),

/***/ "./public/requests/queries/services_queries.ts":
/*!*****************************************************!*\
  !*** ./public/requests/queries/services_queries.ts ***!
  \*****************************************************/
/*! exports provided: getServicesQuery, getRelatedServicesQuery, getServiceNodesQuery, getServiceEdgesQuery, getServiceMetricsQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getServicesQuery", function() { return getServicesQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRelatedServicesQuery", function() { return getRelatedServicesQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getServiceNodesQuery", function() { return getServiceNodesQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getServiceEdgesQuery", function() { return getServiceEdgesQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getServiceMetricsQuery", function() { return getServiceMetricsQuery; });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../common */ "./common/index.ts");
/* harmony import */ var _components_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/common */ "./public/components/common/index.ts");
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


const getServicesQuery = (serviceName = null, DSL) => {
  var _DSL$custom, _DSL$custom$serviceNa, _DSL$custom2, _DSL$custom2$serviceN;

  const query = {
    size: 0,
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
        must_not: []
      }
    },
    aggs: {
      service: {
        terms: {
          field: 'serviceName'
        },
        aggs: {
          trace_count: {
            cardinality: {
              field: 'traceId'
            }
          }
        }
      }
    }
  };

  if (serviceName) {
    query.query.bool.must.push({
      term: {
        serviceName: serviceName
      }
    });
  }

  DSL === null || DSL === void 0 ? void 0 : (_DSL$custom = DSL.custom) === null || _DSL$custom === void 0 ? void 0 : (_DSL$custom$serviceNa = _DSL$custom.serviceNames) === null || _DSL$custom$serviceNa === void 0 ? void 0 : _DSL$custom$serviceNa.map(service => {
    query.query.bool.must.push({
      term: {
        serviceName: service
      }
    });
  });
  DSL === null || DSL === void 0 ? void 0 : (_DSL$custom2 = DSL.custom) === null || _DSL$custom2 === void 0 ? void 0 : (_DSL$custom2$serviceN = _DSL$custom2.serviceNamesExclude) === null || _DSL$custom2$serviceN === void 0 ? void 0 : _DSL$custom2$serviceN.map(service => {
    query.query.bool.must_not.push({
      term: {
        serviceName: service
      }
    });
  });
  return query;
};
const getRelatedServicesQuery = serviceName => {
  const query = {
    size: 0,
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
        must_not: []
      }
    },
    aggs: {
      traces: {
        terms: {
          field: 'traceId',
          size: 10000
        },
        aggs: {
          all_services: {
            terms: {
              field: 'serviceName',
              size: 10000
            }
          },
          service: {
            filter: {
              bool: {
                must: [{
                  term: {
                    serviceName: serviceName
                  }
                }],
                must_not: []
              }
            }
          }
        }
      }
    }
  };
  return query;
};
const getServiceNodesQuery = () => {
  return {
    index: _common__WEBPACK_IMPORTED_MODULE_0__["SERVICE_MAP_INDEX_NAME"],
    size: 0,
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
        must_not: []
      }
    },
    aggs: {
      service_name: {
        terms: {
          field: 'serviceName',
          size: _common__WEBPACK_IMPORTED_MODULE_0__["SERVICE_MAP_MAX_NODES"]
        },
        aggs: {
          trace_group: {
            terms: {
              field: 'traceGroupName',
              size: _common__WEBPACK_IMPORTED_MODULE_0__["SERVICE_MAP_MAX_EDGES"]
            },
            aggs: {
              target_resource: {
                terms: {
                  field: 'target.resource',
                  size: _common__WEBPACK_IMPORTED_MODULE_0__["SERVICE_MAP_MAX_EDGES"]
                }
              }
            }
          }
        }
      }
    }
  };
};
const getServiceEdgesQuery = source => {
  return {
    index: _common__WEBPACK_IMPORTED_MODULE_0__["SERVICE_MAP_INDEX_NAME"],
    size: 0,
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
        must_not: []
      }
    },
    aggs: {
      service_name: {
        terms: {
          field: 'serviceName',
          size: _common__WEBPACK_IMPORTED_MODULE_0__["SERVICE_MAP_MAX_EDGES"]
        },
        aggs: {
          resource: {
            terms: {
              field: `${source}.resource`,
              size: _common__WEBPACK_IMPORTED_MODULE_0__["SERVICE_MAP_MAX_EDGES"]
            },
            aggs: {
              domain: {
                terms: {
                  field: `${source}.domain`,
                  size: _common__WEBPACK_IMPORTED_MODULE_0__["SERVICE_MAP_MAX_EDGES"]
                }
              }
            }
          }
        }
      }
    }
  };
};
const getServiceMetricsQuery = (DSL, serviceNames, map) => {
  var _DSL$query, _DSL$custom3;

  const traceGroupFilter = new Set((DSL === null || DSL === void 0 ? void 0 : (_DSL$query = DSL.query) === null || _DSL$query === void 0 ? void 0 : _DSL$query.bool.must.filter(must => {
    var _must$term;

    return (_must$term = must.term) === null || _must$term === void 0 ? void 0 : _must$term['traceGroup.name'];
  }).map(must => must.term['traceGroup.name'])) || []);
  const targetResource = traceGroupFilter.size > 0 ? [].concat(...[].concat(...serviceNames.map(service => map[service].traceGroups.filter(traceGroup => traceGroupFilter.has(traceGroup.traceGroup)).map(traceGroup => traceGroup.targetResource)))) : [].concat(...Object.keys(map).map(service => Object(_components_common__WEBPACK_IMPORTED_MODULE_1__["getServiceMapTargetResources"])(map, service)));
  const query = {
    size: 0,
    query: {
      bool: {
        must: [],
        should: [],
        must_not: [],
        filter: [{
          terms: {
            serviceName: serviceNames
          }
        }, {
          bool: {
            should: [{
              bool: {
                filter: [{
                  bool: {
                    must_not: {
                      term: {
                        parentSpanId: {
                          value: ''
                        }
                      }
                    }
                  }
                }, {
                  terms: {
                    name: targetResource
                  }
                }]
              }
            }, {
              bool: {
                must: {
                  term: {
                    parentSpanId: {
                      value: ''
                    }
                  }
                }
              }
            }],
            adjust_pure_negative: true,
            boost: 1
          }
        }]
      }
    },
    aggregations: {
      service_name: {
        terms: {
          field: 'serviceName',
          size: _common__WEBPACK_IMPORTED_MODULE_0__["SERVICE_MAP_MAX_NODES"],
          min_doc_count: 1,
          shard_min_doc_count: 0,
          show_term_doc_count_error: false,
          order: [{
            _count: 'desc'
          }, {
            _key: 'asc'
          }]
        },
        aggregations: {
          average_latency_nanos: {
            avg: {
              field: 'durationInNanos'
            }
          },
          average_latency: {
            bucket_script: {
              buckets_path: {
                count: '_count',
                latency: 'average_latency_nanos.value'
              },
              script: 'Math.round(params.latency / 10000) / 100.0'
            }
          },
          error_count: {
            filter: {
              term: {
                'status.code': '2'
              }
            }
          },
          error_rate: {
            bucket_script: {
              buckets_path: {
                total: '_count',
                errors: 'error_count._count'
              },
              script: 'params.errors / params.total * 100'
            }
          }
        }
      }
    }
  };
  if (((_DSL$custom3 = DSL.custom) === null || _DSL$custom3 === void 0 ? void 0 : _DSL$custom3.timeFilter.length) > 0) query.query.bool.must.push(...DSL.custom.timeFilter);
  return query;
};

/***/ }),

/***/ "./public/requests/queries/traces_queries.ts":
/*!***************************************************!*\
  !*** ./public/requests/queries/traces_queries.ts ***!
  \***************************************************/
/*! exports provided: getTraceGroupPercentilesQuery, getTracesQuery, getServiceBreakdownQuery, getSpanDetailQuery, getPayloadQuery, getValidTraceIdsQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTraceGroupPercentilesQuery", function() { return getTraceGroupPercentilesQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTracesQuery", function() { return getTracesQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getServiceBreakdownQuery", function() { return getServiceBreakdownQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSpanDetailQuery", function() { return getSpanDetailQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPayloadQuery", function() { return getPayloadQuery; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getValidTraceIdsQuery", function() { return getValidTraceIdsQuery; });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../common */ "./common/index.ts");
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

const getTraceGroupPercentilesQuery = () => {
  const query = {
    size: 0,
    query: {
      bool: {
        must: [{
          term: {
            parentSpanId: {
              value: ''
            }
          }
        }],
        filter: [],
        should: [],
        must_not: []
      }
    },
    aggs: {
      trace_group_name: {
        terms: {
          field: 'name',
          size: 10000
        },
        aggs: {
          percentiles: {
            percentiles: {
              field: 'durationInNanos',
              percents: Array.from({
                length: 101
              }, (v, i) => i)
            }
          }
        }
      }
    }
  };
  return query;
};
const getTracesQuery = (traceId = null, sort) => {
  const field = (sort === null || sort === void 0 ? void 0 : sort.field) || '_key';
  const direction = (sort === null || sort === void 0 ? void 0 : sort.direction) || 'asc';
  const query = {
    size: 0,
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
        must_not: []
      }
    },
    aggs: {
      traces: {
        terms: {
          field: 'traceId',
          size: _common__WEBPACK_IMPORTED_MODULE_0__["TRACES_MAX_NUM"],
          order: {
            [field]: direction
          }
        },
        aggs: {
          latency: {
            max: {
              script: {
                source: "Math.round(doc['traceGroup.durationInNanos'].value / 10000) / 100.0",
                lang: 'painless'
              }
            }
          },
          trace_group: {
            terms: {
              field: 'traceGroup.name',
              size: 1
            }
          },
          error_count: {
            filter: {
              term: {
                'traceGroup.statusCode': '2'
              }
            }
          },
          last_updated: {
            max: {
              field: 'traceGroup.endTime'
            }
          }
        }
      }
    }
  };

  if (traceId) {
    query.query.bool.must.push({
      term: {
        traceId
      }
    });
  }

  return query;
};
const getServiceBreakdownQuery = traceId => {
  const query = {
    size: 0,
    query: {
      bool: {
        must: [{
          term: {
            traceId
          }
        }],
        filter: [],
        should: [],
        must_not: []
      }
    },
    aggs: {
      service_type: {
        terms: {
          field: 'serviceName',
          order: [{
            total_latency_nanos: 'desc'
          }]
        },
        aggs: {
          total_latency_nanos: {
            sum: {
              field: 'durationInNanos'
            }
          },
          total_latency: {
            bucket_script: {
              buckets_path: {
                count: '_count',
                latency: 'total_latency_nanos.value'
              },
              script: 'Math.round(params.latency / 10000) / 100.0'
            }
          }
        }
      }
    }
  };
  return query;
};
const getSpanDetailQuery = (traceId, size = 200) => {
  const query = {
    size,
    query: {
      bool: {
        must: [{
          term: {
            traceId
          }
        }, {
          exists: {
            field: 'serviceName'
          }
        }],
        filter: [],
        should: [],
        must_not: []
      }
    },
    sort: [{
      startTime: {
        order: 'desc'
      }
    }],
    _source: {
      includes: ['serviceName', 'name', 'startTime', 'endTime', 'spanId', 'status.code', 'durationInNanos']
    }
  };
  return query;
};
const getPayloadQuery = (traceId, size = 1000) => {
  return {
    size,
    query: {
      bool: {
        must: [{
          term: {
            traceId
          }
        }],
        filter: [],
        should: [],
        must_not: []
      }
    }
  };
};
const getValidTraceIdsQuery = DSL => {
  var _DSL$custom, _DSL$custom2, _DSL$custom3, _DSL$custom3$percenti, _DSL$custom4;

  const query = {
    size: 0,
    query: {
      bool: {
        must: [],
        filter: [],
        should: [],
        must_not: []
      }
    },
    aggs: {
      traces: {
        terms: {
          field: 'traceId',
          size: 10000
        }
      }
    }
  };
  if (((_DSL$custom = DSL.custom) === null || _DSL$custom === void 0 ? void 0 : _DSL$custom.timeFilter.length) > 0) query.query.bool.must.push(...DSL.custom.timeFilter);

  if (((_DSL$custom2 = DSL.custom) === null || _DSL$custom2 === void 0 ? void 0 : _DSL$custom2.traceGroup.length) > 0) {
    query.query.bool.filter.push({
      terms: {
        traceGroup: DSL.custom.traceGroup
      }
    });
  }

  if (((_DSL$custom3 = DSL.custom) === null || _DSL$custom3 === void 0 ? void 0 : (_DSL$custom3$percenti = _DSL$custom3.percentiles) === null || _DSL$custom3$percenti === void 0 ? void 0 : _DSL$custom3$percenti.query.bool.should.length) > 0) {
    query.query.bool.should.push(...DSL.custom.percentiles.query.bool.should);
    query.query.bool.minimum_should_match = DSL.custom.percentiles.query.bool.minimum_should_match;
  }

  if (((_DSL$custom4 = DSL.custom) === null || _DSL$custom4 === void 0 ? void 0 : _DSL$custom4.serviceNames.length) > 0) {
    query.query.bool.filter.push({
      terms: {
        serviceName: DSL.custom.serviceNames
      }
    });
  }

  return query;
};

/***/ }),

/***/ "./public/requests/request_handler.ts":
/*!********************************************!*\
  !*** ./public/requests/request_handler.ts ***!
  \********************************************/
/*! exports provided: handleDslRequest, handleIndicesExistRequest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleDslRequest", function() { return handleDslRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleIndicesExistRequest", function() { return handleIndicesExistRequest; });
/* harmony import */ var _server_utils_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../server/utils/constants */ "./server/utils/constants.ts");
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

function handleDslRequest(http, DSL, query) {
  if (DSL !== null && DSL !== void 0 && DSL.query) {
    query.query.bool.must.push(...DSL.query.bool.must);
    query.query.bool.filter.push(...DSL.query.bool.filter);
    query.query.bool.should.push(...DSL.query.bool.should);
    query.query.bool.must_not.push(...DSL.query.bool.must_not);
    if (DSL.query.bool.minimum_should_match) query.query.bool.minimum_should_match = DSL.query.bool.minimum_should_match;
  }

  return http.post(_server_utils_constants__WEBPACK_IMPORTED_MODULE_0__["DSL_ROUTE"], {
    body: JSON.stringify(query)
  }).catch(error => console.error(error));
}
async function handleIndicesExistRequest(http, setIndicesExist) {
  http.post(_server_utils_constants__WEBPACK_IMPORTED_MODULE_0__["INDICES_ROUTE"]).then(exists => setIndicesExist(exists)).catch(() => setIndicesExist(false));
} // export function handleSqlRequest(http: CoreStart['http'], query: string) {
//   console.log('SQL:', query);
//   return http
//     .post(SQL_ROUTE, {
//       body: `{ "query": "${query}" }`,
//     })
//     .catch((error) => console.error(error));
// }

/***/ }),

/***/ "./public/requests/services_request_handler.ts":
/*!*****************************************************!*\
  !*** ./public/requests/services_request_handler.ts ***!
  \*****************************************************/
/*! exports provided: handleServicesRequest, handleServiceMapRequest, handleServiceViewRequest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleServicesRequest", function() { return handleServicesRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleServiceMapRequest", function() { return handleServiceMapRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleServiceViewRequest", function() { return handleServiceViewRequest; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _queries_services_queries__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./queries/services_queries */ "./public/requests/queries/services_queries.ts");
/* harmony import */ var _request_handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./request_handler */ "./public/requests/request_handler.ts");
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



const handleServicesRequest = async (http, DSL, items, setItems, setServiceMap, serviceNameFilter) => {
  Object(_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleDslRequest"])(http, DSL, Object(_queries_services_queries__WEBPACK_IMPORTED_MODULE_1__["getServicesQuery"])(serviceNameFilter, DSL)).then(async response => {
    const serviceObject = await handleServiceMapRequest(http, DSL);
    if (setServiceMap) setServiceMap(serviceObject);
    return Promise.all(response.aggregations.service.buckets.map(bucket => {
      const connectedServices = [...serviceObject[bucket.key].targetServices, ...serviceObject[bucket.key].destServices];
      return {
        name: bucket.key,
        average_latency: serviceObject[bucket.key].latency,
        error_rate: serviceObject[bucket.key].error_rate,
        throughput: serviceObject[bucket.key].throughput,
        traces: bucket.trace_count.value,
        connected_services: connectedServices.join(', '),
        number_of_connected_services: connectedServices.length
      };
    }));
  }).then(newItems => {
    setItems(newItems);
  }).catch(error => console.error(error));
};
const handleServiceMapRequest = async (http, DSL, items, setItems, currService) => {
  const map = {};
  let id = 1;
  await Object(_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleDslRequest"])(http, null, Object(_queries_services_queries__WEBPACK_IMPORTED_MODULE_1__["getServiceNodesQuery"])()).then(response => response.aggregations.service_name.buckets.map(bucket => map[bucket.key] = {
    serviceName: bucket.key,
    id: id++,
    traceGroups: bucket.trace_group.buckets.map(traceGroup => ({
      traceGroup: traceGroup.key,
      targetResource: traceGroup.target_resource.buckets.map(res => res.key)
    })),
    targetServices: [],
    destServices: []
  })).catch(error => console.error(error));
  const targets = {};
  await Object(_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleDslRequest"])(http, null, Object(_queries_services_queries__WEBPACK_IMPORTED_MODULE_1__["getServiceEdgesQuery"])('target')).then(response => response.aggregations.service_name.buckets.map(bucket => {
    bucket.resource.buckets.map(resource => {
      resource.domain.buckets.map(domain => {
        targets[resource.key + ':' + domain.key] = bucket.key;
      });
    });
  })).catch(error => console.error(error));
  await Object(_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleDslRequest"])(http, null, Object(_queries_services_queries__WEBPACK_IMPORTED_MODULE_1__["getServiceEdgesQuery"])('destination')).then(response => Promise.all(response.aggregations.service_name.buckets.map(bucket => {
    bucket.resource.buckets.map(resource => {
      resource.domain.buckets.map(domain => {
        const targetService = targets[resource.key + ':' + domain.key];
        if (map[bucket.key].targetServices.indexOf(targetService) === -1) map[bucket.key].targetServices.push(targetService);
        if (map[targetService].destServices.indexOf(bucket.key) === -1) map[targetService].destServices.push(bucket.key);
      });
    });
  }))).catch(error => console.error(error)); // service map handles DSL differently

  const latencies = await Object(_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleDslRequest"])(http, DSL, Object(_queries_services_queries__WEBPACK_IMPORTED_MODULE_1__["getServiceMetricsQuery"])(DSL, Object.keys(map), map));
  latencies.aggregations.service_name.buckets.map(bucket => {
    map[bucket.key].latency = bucket.average_latency.value;
    map[bucket.key].error_rate = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.round(bucket.error_rate.value, 2) || 0;
    map[bucket.key].throughput = bucket.doc_count;
  });

  if (currService) {
    const traces = await Object(_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleDslRequest"])(http, DSL, Object(_queries_services_queries__WEBPACK_IMPORTED_MODULE_1__["getRelatedServicesQuery"])(currService)).then(response => response.aggregations.traces.buckets.filter(bucket => bucket.service.doc_count > 0)).catch(error => console.error(error));
    const maxNumServices = Object.keys(map).length;
    const relatedServices = new Set();

    for (let i = 0; i < traces.length; i++) {
      traces[i].all_services.buckets.map(bucket => relatedServices.add(bucket.key));
      if (relatedServices.size === maxNumServices) break;
    }

    map[currService].relatedServices = [...relatedServices];
  }

  if (setItems) setItems(map);
  return map;
};
const handleServiceViewRequest = (serviceName, http, DSL, fields, setFields) => {
  Object(_request_handler__WEBPACK_IMPORTED_MODULE_2__["handleDslRequest"])(http, DSL, Object(_queries_services_queries__WEBPACK_IMPORTED_MODULE_1__["getServicesQuery"])(serviceName)).then(async response => {
    const bucket = response.aggregations.service.buckets[0];
    if (!bucket) return {};
    const serviceObject = await handleServiceMapRequest(http, DSL);
    const connectedServices = [...serviceObject[bucket.key].targetServices, ...serviceObject[bucket.key].destServices];
    return {
      name: bucket.key,
      connected_services: connectedServices.join(', '),
      number_of_connected_services: connectedServices.length,
      average_latency: serviceObject[bucket.key].latency,
      error_rate: serviceObject[bucket.key].error_rate,
      throughput: serviceObject[bucket.key].throughput,
      traces: bucket.trace_count.value
    };
  }).then(newFields => {
    setFields(newFields);
  }).catch(error => console.error(error));
};

/***/ }),

/***/ "./public/requests/traces_request_handler.ts":
/*!***************************************************!*\
  !*** ./public/requests/traces_request_handler.ts ***!
  \***************************************************/
/*! exports provided: handleValidTraceIds, handleTracesRequest, handleTraceViewRequest, handleTracesChartsRequest, handlePayloadRequest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleValidTraceIds", function() { return handleValidTraceIds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleTracesRequest", function() { return handleTracesRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleTraceViewRequest", function() { return handleTraceViewRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handleTracesChartsRequest", function() { return handleTracesChartsRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "handlePayloadRequest", function() { return handlePayloadRequest; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "moment");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! uuid */ "./node_modules/uuid/index.js");
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common */ "./common/index.ts");
/* harmony import */ var _components_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/common */ "./public/components/common/index.ts");
/* harmony import */ var _queries_traces_queries__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./queries/traces_queries */ "./public/requests/queries/traces_queries.ts");
/* harmony import */ var _request_handler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./request_handler */ "./public/requests/request_handler.ts");
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







const handleValidTraceIds = (http, DSL) => {
  return Object(_request_handler__WEBPACK_IMPORTED_MODULE_6__["handleDslRequest"])(http, {}, Object(_queries_traces_queries__WEBPACK_IMPORTED_MODULE_5__["getValidTraceIdsQuery"])(DSL)).then(response => response.aggregations.traces.buckets.map(bucket => bucket.key)).catch(error => console.error(error));
};
const handleTracesRequest = async (http, DSL, timeFilterDSL, items, setItems, sort) => {
  const binarySearch = (arr, target) => {
    if (!arr) return Number.NaN;
    let low = 0;
    let high = arr.length;
    let mid;

    while (low < high) {
      mid = Math.floor((low + high) / 2);
      if (arr[mid] < target) low = mid + 1;else high = mid;
    }

    return Math.max(0, Math.min(100, low));
  }; // percentile should only be affected by timefilter


  const percentileRanges = await Object(_request_handler__WEBPACK_IMPORTED_MODULE_6__["handleDslRequest"])(http, timeFilterDSL, Object(_queries_traces_queries__WEBPACK_IMPORTED_MODULE_5__["getTraceGroupPercentilesQuery"])()).then(response => {
    const map = {};
    response.aggregations.trace_group_name.buckets.forEach(traceGroup => {
      map[traceGroup.key] = Object.values(traceGroup.percentiles.values).map(value => Object(_components_common__WEBPACK_IMPORTED_MODULE_4__["nanoToMilliSec"])(value));
    });
    return map;
  });
  return Object(_request_handler__WEBPACK_IMPORTED_MODULE_6__["handleDslRequest"])(http, DSL, Object(_queries_traces_queries__WEBPACK_IMPORTED_MODULE_5__["getTracesQuery"])(undefined, sort)).then(response => {
    return Promise.all(response.aggregations.traces.buckets.map(bucket => {
      var _bucket$trace_group$b, _bucket$trace_group$b2;

      return {
        trace_id: bucket.key,
        trace_group: (_bucket$trace_group$b = bucket.trace_group.buckets[0]) === null || _bucket$trace_group$b === void 0 ? void 0 : _bucket$trace_group$b.key,
        latency: bucket.latency.value,
        last_updated: moment__WEBPACK_IMPORTED_MODULE_1___default()(bucket.last_updated.value).format(_common__WEBPACK_IMPORTED_MODULE_3__["DATE_FORMAT"]),
        error_count: bucket.error_count.doc_count > 0 ? 'Yes' : 'No',
        percentile_in_trace_group: binarySearch(percentileRanges[(_bucket$trace_group$b2 = bucket.trace_group.buckets[0]) === null || _bucket$trace_group$b2 === void 0 ? void 0 : _bucket$trace_group$b2.key], bucket.latency.value),
        actions: '#'
      };
    }));
  }).then(newItems => {
    setItems(newItems);
  }).catch(error => console.error(error));
};
const handleTraceViewRequest = (traceId, http, fields, setFields) => {
  Object(_request_handler__WEBPACK_IMPORTED_MODULE_6__["handleDslRequest"])(http, null, Object(_queries_traces_queries__WEBPACK_IMPORTED_MODULE_5__["getTracesQuery"])(traceId)).then(async response => {
    var _bucket$trace_group$b3;

    const bucket = response.aggregations.traces.buckets[0];
    return {
      trace_id: bucket.key,
      trace_group: (_bucket$trace_group$b3 = bucket.trace_group.buckets[0]) === null || _bucket$trace_group$b3 === void 0 ? void 0 : _bucket$trace_group$b3.key,
      last_updated: moment__WEBPACK_IMPORTED_MODULE_1___default()(bucket.last_updated.value).format(_common__WEBPACK_IMPORTED_MODULE_3__["DATE_FORMAT"]),
      user_id: 'N/A',
      latency: bucket.latency.value,
      latency_vs_benchmark: 'N/A',
      percentile_in_trace_group: 'N/A',
      error_count: bucket.error_count.doc_count > 0 ? 'Yes' : 'No',
      errors_vs_benchmark: 'N/A'
    };
  }).then(newFields => {
    setFields(newFields);
  }).catch(error => console.error(error));
};
const handleTracesChartsRequest = async (traceId, http, serviceBreakdownData, setServiceBreakdownData, spanDetailData, setSpanDetailData) => {
  const colors = ['#7492e7', '#c33d69', '#2ea597', '#8456ce', '#e07941', '#3759ce', '#ce567c', '#9469d6', '#4066df', '#da7596', '#a783e1', '#5978e3'];
  const colorMap = {};
  let index = 0;
  Promise.all([Object(_request_handler__WEBPACK_IMPORTED_MODULE_6__["handleDslRequest"])(http, null, Object(_queries_traces_queries__WEBPACK_IMPORTED_MODULE_5__["getServiceBreakdownQuery"])(traceId)).then(response => Promise.all(response.aggregations.service_type.buckets.map(bucket => {
    colorMap[bucket.key] = colors[index++ % colors.length];
    return {
      name: bucket.key,
      color: colorMap[bucket.key],
      value: bucket.total_latency.value,
      benchmark: 0
    };
  }))).then(newItems => {
    const latencySum = newItems.map(item => item.value).reduce((a, b) => a + b, 0);
    return [{
      values: newItems.map(item => latencySum === 0 ? 100 : item.value / latencySum * 100),
      labels: newItems.map(item => item.name),
      benchmarks: newItems.map(item => item.benchmark),
      marker: {
        colors: newItems.map(item => item.color)
      },
      type: 'pie',
      textinfo: 'none',
      hovertemplate: '%{label}<br>%{value:.2f}%<extra></extra>'
    }];
  }).then(newItems => {
    setServiceBreakdownData(newItems);
  }).catch(error => console.error(error)), Object(_request_handler__WEBPACK_IMPORTED_MODULE_6__["handleDslRequest"])(http, null, Object(_queries_traces_queries__WEBPACK_IMPORTED_MODULE_5__["getSpanDetailQuery"])(traceId))]).then(response => hitsToSpanDetailData(response[1].hits.hits, colorMap)).then(newItems => setSpanDetailData(newItems)).catch(error => console.error(error));
};

const hitsToSpanDetailData = async (hits, colorMap) => {
  const data = {
    gantt: [],
    table: [],
    ganttMaxX: 0
  };
  if (hits.length === 0) return data;
  const minStartTime = Object(_components_common__WEBPACK_IMPORTED_MODULE_4__["nanoToMilliSec"])(hits[hits.length - 1].sort[0]);
  let maxEndTime = 0;
  hits.forEach(hit => {
    const startTime = Object(_components_common__WEBPACK_IMPORTED_MODULE_4__["nanoToMilliSec"])(hit.sort[0]) - minStartTime;

    const duration = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.round(Object(_components_common__WEBPACK_IMPORTED_MODULE_4__["nanoToMilliSec"])(hit._source.durationInNanos), 2);

    const serviceName = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.get(hit, ['_source', 'serviceName']);

    const name = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.get(hit, '_source.name');

    const error = hit._source['status.code'] ? 'Error' : '';
    const uniqueLabel = `${serviceName} <br>${name} ` + Object(uuid__WEBPACK_IMPORTED_MODULE_2__["v1"])();
    maxEndTime = Math.max(maxEndTime, startTime + duration);
    data.table.push({
      service_name: serviceName,
      span_id: hit._source.spanId,
      latency: duration,
      vs_benchmark: 0,
      error,
      start_time: hit._source.startTime,
      end_time: hit._source.endTime
    });
    data.gantt.push({
      x: [startTime],
      y: [uniqueLabel],
      marker: {
        color: 'rgba(0, 0, 0, 0)'
      },
      width: 0.4,
      type: 'bar',
      orientation: 'h',
      hoverinfo: 'none',
      showlegend: false
    }, {
      x: [duration],
      y: [uniqueLabel],
      text: [error],
      textfont: {
        color: ['#c14125']
      },
      textposition: 'outside',
      marker: {
        color: colorMap[serviceName]
      },
      width: 0.4,
      type: 'bar',
      orientation: 'h',
      hovertemplate: '%{x}<extra></extra>'
    });
  });
  data.ganttMaxX = maxEndTime;
  return data;
};

const handlePayloadRequest = (traceId, http, payloadData, setPayloadData) => {
  Object(_request_handler__WEBPACK_IMPORTED_MODULE_6__["handleDslRequest"])(http, null, Object(_queries_traces_queries__WEBPACK_IMPORTED_MODULE_5__["getPayloadQuery"])(traceId)).then(response => setPayloadData(JSON.stringify(response.hits.hits, null, 2))).catch(error => console.error(error));
};

/***/ }),

/***/ "./server/utils/constants.ts":
/*!***********************************!*\
  !*** ./server/utils/constants.ts ***!
  \***********************************/
/*! exports provided: SQL_CLUSTER, INDICES_ROUTE, DSL_ROUTE, SQL_ROUTE, SQL_ES_ENDPOINT */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SQL_CLUSTER", function() { return SQL_CLUSTER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INDICES_ROUTE", function() { return INDICES_ROUTE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DSL_ROUTE", function() { return DSL_ROUTE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SQL_ROUTE", function() { return SQL_ROUTE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SQL_ES_ENDPOINT", function() { return SQL_ES_ENDPOINT; });
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
const SQL_CLUSTER = 'opendistro_sql';
const INDICES_ROUTE = '/api/trace_analytics/indices';
const DSL_ROUTE = '/api/trace_analytics/query';
const SQL_ROUTE = '/api/trace_analytics/sqlquery';
const SQL_ES_ENDPOINT = '/_opendistro/_sql?format=json';

/***/ })

}]);
//# sourceMappingURL=1.plugin.js.map
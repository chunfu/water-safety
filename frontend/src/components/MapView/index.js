import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useMemo,
} from 'react';
import { Map, TileLayer, Popup } from 'react-leaflet';
import Leaflet from 'leaflet';
import { GeoJSONFillable } from 'react-leaflet-geojson-patterns';
import { SelectList } from 'gestalt';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import ExcelUploader from '../ExcelUploader';
import CountyTabView from '../CountyTabView';
import RiverTabView from '../RiverTabView';
import { RiverPoints, CountyRiverList } from '../RiverComps';
import { defaultCountyConfig, countyKeys } from './countyConfig';
import { getRiverConfig } from './riverConfig';
import { IndexContext } from '../../App';
import {
  eventCounty,
  eventAm,
  eventTime,
  eventLocation,
  eventYear,
  eventMonth,
} from '../../const';

const SelectListContainer = styled.div`
  position: absolute;
  right: 5vw;
  top: ${(props) => props.top || '15vh'};
  width: 200px;
  z-index: 401;
`;

const countySelectOptions = [{ value: '', label: '選擇縣市' }].concat(
  countyKeys.map((key) => ({
    value: key,
    label: key,
  })),
);

const geoJsonStyle = {
  color: 'black',
  weight: 2,
  fillOpacity: 0,
};

const geoJsonFocusStyle = {
  ...geoJsonStyle,
  fillOpacity: 1,
  fillColor: '#ffee93',
};

const maxBounds = [
  [21, 117],
  [27, 123],
];

const DEFAULT_ZOOM_LEVEL = 8;
const MAP_INIT_PROPS = {
  center: [23.973837, 120.9775031],
  maxBounds,
  zoom: DEFAULT_ZOOM_LEVEL,
  minZoom: DEFAULT_ZOOM_LEVEL,
  maxZoom: DEFAULT_ZOOM_LEVEL + 2,
};

const TYPE_SELECT_COUTY = 'selectCounty';
const TYPE_SELECT_RIVER = 'selectRiver';
const initState = {
  selectedCounty: '',
  selectedRiver: '',
};

// TODO: should be calling cleanup cb automatically
const reducer = (state, action) => {
  const { type, value, cb = () => {} } = action;
  cb(value);
  switch (type) {
    case TYPE_SELECT_COUTY:
      return {
        ...state,
        selectedCounty: value,
        selectedRiver: '',
      };
    case TYPE_SELECT_RIVER:
      return {
        ...state,
        selectedCounty: '',
        selectedRiver: value,
      };
    default:
      return state;
  }
};

const MapView = (props) => {
  const contextValue = useContext(IndexContext);
  const [mapProps, updateMapProps] = useState(MAP_INIT_PROPS);
  const [countyConfig, updateCountyConfig] = useState(defaultCountyConfig);
  const [riverConfig, updateRiverConfig] = useState({});
  const riverKeys = useMemo(() => Object.keys(riverConfig), [riverConfig]);
  const [state, dispatch] = useReducer(reducer, initState);
  const { selectedRiver, selectedCounty } = state;

  useEffect(() => {
    async function fn() {
      const { defaultRiverConfig, riverKeys } = await getRiverConfig();
      updateRiverConfig(defaultRiverConfig);
    }
    fn();
  }, []);

  useEffect(() => {
    const newCountyConfig = countyKeys.reduce((acc, key) => {
      const config = countyConfig[key];
      // reset others' style
      const style = key === selectedCounty ? geoJsonFocusStyle : geoJsonStyle;
      return {
        ...acc,
        [key]: {
          ...config,
          style,
        },
      };
    }, {});
    updateCountyConfig(newCountyConfig);
  }, [selectedCounty]);

  // make center of map exactly the same as selected county
  const onSelectCountySideEffect = (countyKey) => {
    const { geojson } = countyConfig[countyKey];
    const gj = Leaflet.geoJSON(geojson);
    updateMapProps({
      ...mapProps,
      center: gj.getBounds().getCenter(),
      zoom: 10,
    });
  };

  const onSelectCounty = (countyKey) => {
    dispatch({
      type: TYPE_SELECT_COUTY,
      value: countyKey,
      cb: onSelectCountySideEffect,
    });
  };

  const onSelectRiver = (riverKey) => {
    dispatch({
      type: TYPE_SELECT_RIVER,
      value: riverKey,
    });
  };

  const makeAccidentData = ({ sheetName, record }) => {
    const obj = {
      [eventLocation]: record[eventLocation],
      [eventYear]: sheetName,
      [eventMonth]: record[eventMonth],
      [eventAm]: record[eventAm],
      [eventTime]: record[eventTime],
    };
    return obj;
  };

  const onDropFile = (sheetsData) => {
    let newCountyConfig = { ...countyConfig };
    Object.keys(sheetsData).forEach((sheetName) => {
      // iterate data from each sheet
      const dataArr = sheetsData[sheetName];
      dataArr.forEach((d) => {
        // iterate each record from data

        // find the corresponding county config
        const county = countyKeys.find(
          (countyKey) =>
            newCountyConfig[countyKey].name.indexOf(d[eventCounty]) > -1,
        );

        if (!county) {
          // edge case, print it out
          console.warn(d[eventCounty], d);
          return;
        }

        let config = newCountyConfig[county];

        // insert current record into county config
        let { accidentData = [] } = config;

        config = {
          ...config,
          accidentData: accidentData.concat(
            makeAccidentData({
              sheetName,
              record: d,
            }),
          ),
        };

        newCountyConfig = {
          ...newCountyConfig,
          [county]: config,
        };
      });
    });

    // update new event into that config
    updateCountyConfig(newCountyConfig);
  };

  return (
    <>
      <ExcelUploader onDropFile={onDropFile} />
      <SelectListContainer>
        <SelectList
          options={countySelectOptions}
          label="台灣縣市"
          value={selectedCounty}
          onChange={({ value }) => {
            onSelectCounty(value);
          }}
        />
      </SelectListContainer>
      {selectedCounty && (
        <Draggable>
          <CountyTabView
            config={countyConfig[selectedCounty]}
            keyName={selectedCounty}
          />
        </Draggable>
      )}
      {selectedCounty && (
        <SelectListContainer top="25vh">
          <CountyRiverList
            county={selectedCounty}
            riverConfig={riverConfig}
            riverKeys={riverKeys}
            selectedRiver={selectedRiver}
            onSelectRiver={onSelectRiver}
          />
        </SelectListContainer>
      )}
      {selectedRiver && (
        <Draggable>
          <RiverTabView
            config={riverConfig[selectedRiver]}
            keyName={selectedRiver}
          />
        </Draggable>
      )}
      {contextValue.THUNDERFOREST_APIKEY && (
        <Map {...mapProps}>
          <TileLayer
            url="https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey={apikey}"
            attribution='&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            apikey={contextValue.THUNDERFOREST_APIKEY}
          />
          {/* https://leaflet-extras.github.io/leaflet-providers/preview/ */}
          {/* <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
          {countyKeys.map((key) => {
            const { geojson, style = geoJsonStyle } = countyConfig[key];
            return (
              <GeoJSONFillable
                data={geojson}
                style={(feature) => style}
                onClick={() => {
                  onSelectCounty(key);
                }}
              />
            );
          })}
          <RiverPoints
            riverKeys={riverKeys}
            riverConfig={riverConfig}
            onSelectRiver={onSelectRiver}
          />
        </Map>
      )}
    </>
  );
};

export default MapView;

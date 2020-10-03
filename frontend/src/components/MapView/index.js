import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useMemo,
} from 'react';
import axios from 'axios';
import { Map, TileLayer, Popup } from 'react-leaflet';
import Leaflet from 'leaflet';
import { GeoJSONFillable } from 'react-leaflet-geojson-patterns';
import { SelectList } from 'gestalt';
import Draggable from 'react-draggable';
import ExcelUploader from '../ExcelUploader';
import CountyTabView from '../CountyTabView';
import RiverTabView from '../RiverTabView';
import { SelectListContainer, Tooltip } from '../StyledComps';
import { RiverPoints, CountyRiverList } from '../RiverComps';
import { getCountyConfig, countyKeys } from './countyConfig';
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

const file2form = (name) => (file) => {
  let formData = new FormData();
  formData.append(name, file, `${name}.xlsx`);

  return formData;
};

const countySelectOptions = [{ value: '', label: '選擇縣市' }].concat(
  countyKeys.map((key) => ({
    value: key,
    label: key,
  }))
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
  maxZoom: DEFAULT_ZOOM_LEVEL + 3,
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

const getCountyRiverConfig = (county, riverConfig) => {
  return Object.keys(riverConfig)
    .filter((r) => riverConfig[r].county === county)
    .map((r) => riverConfig[r]);
};

const MapView = (props) => {
  const contextValue = useContext(IndexContext);
  const [mapProps, updateMapProps] = useState(MAP_INIT_PROPS);
  const [countyConfig, updateCountyConfig] = useState({});
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
    async function fn() {
      const countyConfig = await getCountyConfig();
      updateCountyConfig(countyConfig);
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
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach(async (file) => {
      const formData = file2form('drown_events')(file);
      await axios.post('/api/county', formData);
    });
  };

  return (
    <>
      <ExcelUploader onDrop={onDrop} />
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
            rivers={getCountyRiverConfig(selectedCounty, riverConfig)}
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
      <Tooltip>
        <div>
          <div className="marker-div-icon red" />
          縣市公告禁止前往水域
        </div>
        <div>
          <div className="marker-div-icon yellow" />
          曾經發生學生溺水水域
        </div>
        <div>
          <div className="marker-div-icon purple" />
          縣市提示須注意水域
        </div>
      </Tooltip>
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
              geojson && (
                <GeoJSONFillable
                  data={geojson}
                  style={(feature) => style}
                  onClick={() => {
                    onSelectCounty(key);
                  }}
                />
              )
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

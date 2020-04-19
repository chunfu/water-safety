import React, { useState, useEffect, useReducer } from 'react';
import { Map, TileLayer, Popup } from 'react-leaflet';
import { GeoJSONFillable } from 'react-leaflet-geojson-patterns';
import { SelectList } from 'gestalt';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import ExcelUploader from '../ExcelUploader';
import CountyTabView from '../CountyTabView';
import RiverTabView from '../RiverTabView';
import { defaultCountyConfig, countyKeys } from './countyConfig';
import { defaultRiverConfig, riverKeys } from './riverConfig';
import CustomizedMarker from './CustomizedMarker';
import { eventCounty, eventAm, eventLocation, eventMonth } from '../../const';

const SelectListContainer = styled.div`
  position: absolute;
  right: 5vw;
  top: 15vh;
  width: 200px;
  z-index: 1001;
`;

const countySelectOptions = [{ value: '', label: '選擇縣市' }].concat(
  countyKeys.map((key) => ({
    value: key,
    label: defaultCountyConfig[key].name[0],
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
  fillColor: '#FDC500',
};

const mapProps = {
  center: [23.973837, 120.9775031],
  zoom: 8,
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
  switch (type) {
    case TYPE_SELECT_COUTY:
      cb(value);
      return {
        ...state,
        selectedCounty: value,
        selectedRiver: '',
      };
    case TYPE_SELECT_RIVER:
      cb(value);
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
  const [countyConfig, updateCountyConfig] = useState(defaultCountyConfig);
  const [state, dispatch] = useReducer(reducer, initState);
  console.log(state);
  const { selectedRiver, selectedCounty } = state;

  const onSelectCountyCb = (selectedCounty) => {
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
  };

  const onSelectRiverCb = () => onSelectCountyCb('');

  const onSelectCounty = (countyKey) => {
    dispatch({
      type: TYPE_SELECT_COUTY,
      value: countyKey,
      cb: onSelectCountyCb,
    });
  };

  const onSelectRiver = (riverKey) => {
    dispatch({
      type: TYPE_SELECT_RIVER,
      value: riverKey,
      cb: onSelectRiverCb,
    });
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
        let { yearlyAccidents = {} } = config;
        let accidents = yearlyAccidents[sheetName] || [];
        accidents.push({
          [eventLocation]: d[eventLocation],
          [eventMonth]: d[eventMonth],
          [eventAm]: d[eventAm],
        });

        config = {
          ...config,
          yearlyAccidents: {
            ...yearlyAccidents,
            [sheetName]: accidents,
          },
        };

        newCountyConfig = {
          ...newCountyConfig,
          [county]: config,
        };
      });
    });

    // update insert new event into that config
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
          <CountyTabView config={countyConfig[selectedCounty]} />
        </Draggable>
      )}
      {selectedRiver && (
        <Draggable>
          <RiverTabView config={defaultRiverConfig[selectedRiver]} />
        </Draggable>
      )}
      <Map {...mapProps}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
        {riverKeys.map((key) => {
          const { location } = defaultRiverConfig[key];
          return (
            <CustomizedMarker
              position={location}
              onClick={() => onSelectRiver(key)}
            ></CustomizedMarker>
          );
        })}
      </Map>
    </>
  );
};

export default MapView;

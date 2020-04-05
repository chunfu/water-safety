import React, { useState, useEffect } from 'react';
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  withLeaflet,
} from 'react-leaflet';
import { GeoJSONFillable } from 'react-leaflet-geojson-patterns';
import { SelectList } from 'gestalt';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import TabView from './TabView';
import { defaultCountyConfig, countyKeys } from './countyConfig';
import ExcelUploader from './ExcelUploader';

const SelectListContainer = styled.div`
  position: absolute;
  right: 5vw;
  top: 15vh;
  width: 200px;
  z-index: 1001;
`;

const TabViewContainer = styled.div`
  position: absolute;
  left: 5vw;
  top: 10vh;
  width: 30vw;
  z-index: 1001;
  cursor: move;
`;

const countySelectOptions = [{ value: '', label: '選擇縣市' }].concat(
  countyKeys.map(key => ({
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

const MapView = props => {
  const [countyConfig, updateCountyConfig] = useState(defaultCountyConfig);
  const [selectedCounty, setSelectedCounty] = useState('');

  const onEachFeature = (feature, layer) => {
    /*
    const countyName = feature.properties.COUNTY;
    const popupContent = `
    <Popup>
      ${countyName}
    </Popup>
    `;
    layer.bindPopup(popupContent);
    */
  };

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

  const onSelectCounty = countyKey => {
    setSelectedCounty(countyKey);
  };

  const onDropFile = sheetsData => {
    const eventCounty = '發生所在縣市';
    const eventLocation = '發生地點名稱';
    const eventMonth = '發生月份';
    const eventAm = '發生時段(上/下午)';

    let newCountyConfig = { ...countyConfig };
    Object.keys(sheetsData).forEach(sheetName => {
      // iterate data from each sheet
      const dataArr = sheetsData[sheetName];
      dataArr.forEach(d => {
        // iterate each record from data

        // find the corresponding county config
        const county = countyKeys.find(
          countyKey =>
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
          <TabViewContainer>
            <TabView config={countyConfig[selectedCounty]} />
          </TabViewContainer>
        </Draggable>
      )}
      <Map {...mapProps}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {countyKeys.map(key => {
          const { geojson, style = geoJsonStyle } = countyConfig[key];
          return (
            <GeoJSONFillable
              data={geojson}
              style={feature => style}
              onEachFeature={onEachFeature}
              onClick={() => {
                onSelectCounty(key);
              }}
            />
          );
        })}
      </Map>
    </>
  );
};

export default MapView;

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
import defaultCountyConfig from './countyConfig';

const SelectListContainer = styled.div`
  position: absolute;
  right: 5vw;
  top: 10vh;
  width: 200px;
  z-index: 1001;
`;

const TabViewContainer = styled.div`
  position: absolute;
  left: 5vw;
  top: 10vh;
  width: 30vw;
  height: 60vh;
  z-index: 1001;
  cursor: move;
`;

const countySelectOptions = Object.keys(defaultCountyConfig).map(key => ({
  value: key,
  label: defaultCountyConfig[key].name,
}));

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
  const [selectedCounty, setSelectedCounty] = useState(null);

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

  const onClickFeature = countyKey => {
    const newCountyConfig = Object.keys(countyConfig).reduce((acc, key) => {
      const config = countyConfig[key];
      const style = key === countyKey ? geoJsonFocusStyle : geoJsonStyle;
      return {
        ...acc,
        [key]: {
          ...config,
          style,
        },
      };
    }, {});
    updateCountyConfig(newCountyConfig);
    setSelectedCounty(countyKey);
  };

  const items = [
    { name: '發生學生溺水死亡意外之水域', content: <h1>yooo</h1> },
    { name: '重覆發生學生溺水死亡意外之水域', content: <h1>woooo</h1> },
  ];

  return (
    <>
      <SelectListContainer>
        <SelectList
          options={countySelectOptions}
          placeholder="選擇縣市"
          label="台灣縣市"
          value={selectedCounty}
          onChange={({ value }) => setSelectedCounty(value)}
        />
      </SelectListContainer>
      <Draggable>
        <TabViewContainer>
          <TabView items={items} />
        </TabViewContainer>
      </Draggable>
      <Map {...mapProps}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.keys(countyConfig).map(key => {
          const { geojson, style = geoJsonStyle } = countyConfig[key];
          return (
            <GeoJSONFillable
              data={geojson}
              style={feature => style}
              onEachFeature={onEachFeature}
              onClick={() => onClickFeature(key)}
            />
          );
        })}
      </Map>
    </>
  );
};

export default MapView;

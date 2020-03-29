import React, { useState, useEffect } from 'react';
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  withLeaflet,
} from 'react-leaflet';
import DialogDefault from 'react-leaflet-dialog';
import { GeoJSONFillable } from 'react-leaflet-geojson-patterns';
import TaipeiGeoJson from '../../geojson/taipei.json';
import ChanghuaGeoJson from '../../geojson/changhua.json';

const Dialog = withLeaflet(DialogDefault);

const geoJsonStyle = {
  color: 'black',
  weight: 2,
  fillOpacity: 0,
};

const geoJsonFocusStyle = {
  color: 'black',
  weight: 2,
  fillOpacity: 1,
  fillColor: '#FDC500',
};

const mapProps = {
  center: [23.973837, 120.9775031],
  zoom: 8,
};

const MapView = props => {
  const [countyGeoJsonStyle, updateCountyGeoJsonStyle] = useState(geoJsonStyle);
  const [countyConfig, updateCountyConfig] = useState({
    臺北市: { geojson: TaipeiGeoJson },
    彰化縣: { geojson: ChanghuaGeoJson },
  });

  const onClickGenBoundry = () => {
    updateCountyGeoJsonStyle(geoJsonFocusStyle);
  };

  const onEachFeature = (feature, layer) => {
    const countyName = feature.properties.COUNTY;
    const popupContent = `
    <Popup>
      ${countyName}
    </Popup>
    `;
    layer.bindPopup(popupContent);
  };

  const onClickFeature = countyName => {
    const newCountyConfig = Object.keys(countyConfig).reduce((acc, name) => {
      const config = countyConfig[name];
      const style = name === countyName ? geoJsonFocusStyle : geoJsonStyle;
      return {
        ...acc,
        [name]: {
          ...config,
          style,
        },
      };
    }, {});
    updateCountyConfig(newCountyConfig);
  };

  return (
    <>
      <button onClick={onClickGenBoundry}>generate boundry geojson</button>
      <Map {...mapProps}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.keys(countyConfig).map(countyName => {
          const { geojson, style = geoJsonStyle } = countyConfig[countyName];
          return (
            <GeoJSONFillable
              data={geojson}
              style={feature => style}
              onEachFeature={onEachFeature}
              onClick={() => onClickFeature(countyName)}
            />
          );
        })}
        <Dialog id="dialog1">
          <div>Dialog content.</div>
        </Dialog>
      </Map>
    </>
  );
};

export default MapView;

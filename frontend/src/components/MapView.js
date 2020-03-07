import React, { useState, useEffect } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

const MapView = props => {
  const defaultState = {
    lat: 25,
    lng: 121,
    zoom: 9,
  };
  const [state, setState] = useState(defaultState);
  const position = [state.lat, state.lng];
  const position2 = [state.lat + 1, state.lng + 1]

  const onClick = () => {
    const { zoom } = state;
    const newState = {
      ...state,
      zoom: zoom + 1,
    };
    setState(newState);
  }

  return (
    <>
    <button onClick={onClick}>zoom in</button>
    <Map center={position} zoom={state.zoom}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Marker position={position2}>
        <Popup>
          second popup
        </Popup>
      </Marker>
    </Map>
    </>
  );
};

export default MapView;

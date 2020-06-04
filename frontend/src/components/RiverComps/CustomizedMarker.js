import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

const CustomizedMarker = props => {
  const { children, data } = props;
  const { position, yellow, red } = data;

  const className = red ? 'red' : yellow ? 'yellow' : 'purple';
  const divIcon = new L.divIcon({ className: `marker-div-icon ${className}` });

  return (
    <Marker {...props} position={position} icon={divIcon}>
      {children}
    </Marker>
  );
};

export default CustomizedMarker;

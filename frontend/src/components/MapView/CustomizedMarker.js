import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

const divIcon = new L.divIcon({ className: 'marker-div-icon' });

const CustomizedMarker = props => {
  const { children } = props;
  return (
    <Marker {...props} icon={divIcon}>
      {children}
    </Marker>
  );
};

export default CustomizedMarker;

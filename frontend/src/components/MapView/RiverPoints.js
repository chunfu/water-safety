import React from 'react';
import CustomizedMarker from './CustomizedMarker';

const RiverPoints = (props) => {
  const { riverKeys, riverConfig, onSelectRiver } = props;
  const filteredPoints = riverKeys.filter((key) => {
    const { purple, yellow, ypoints, rpoints } = riverConfig[key];
    if (purple === 1 && (ypoints.length || rpoints.length)) return false;
    if (yellow === 1 && rpoints.length) return false;
    return true;
  });
  const points = filteredPoints.map((key) => {
    const rconfig = riverConfig[key];
    return (
      <CustomizedMarker
        data={rconfig}
        onClick={() => onSelectRiver(key)}
      ></CustomizedMarker>
    );
  });

  return <>{points}</>;
};

export default RiverPoints;

import React from 'react';
import { SelectList } from 'gestalt';
import { compact } from 'lodash';
import CustomizedMarker from './CustomizedMarker';

const visiblePoints = (riverConfig) => (key) => {
  const { purple, yellow, ypoints, rpoints, position } = riverConfig[key];
  if (purple === 1 && (ypoints.length || rpoints.length)) return false;
  if (yellow === 1 && rpoints.length) return false;

  if (compact(position).length) return true;
  else return false;
};

export const CountyRiverList = (props) => {
  const {
    selectedRiver,
    county,
    riverConfig,
    riverKeys,
    onSelectRiver = () => {},
  } = props;

  const countyRivers = riverKeys
    .filter((key) => {
      return riverConfig[key].county === county;
    })
    .filter(visiblePoints(riverConfig));

  const options = [{ value: '', label: '選擇水域' }].concat(
    countyRivers.map((cr) => ({ value: cr, label: cr })),
  );

  return (
    <SelectList
      options={options}
      label="台灣縣市"
      value={selectedRiver}
      onChange={({ value }) => {
        onSelectRiver(value);
      }}
    />
  );
};

export const RiverPoints = (props) => {
  const { riverKeys, riverConfig, onSelectRiver } = props;
  const filteredPoints = riverKeys.filter(visiblePoints(riverConfig));
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

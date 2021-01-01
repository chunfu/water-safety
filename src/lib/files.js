import findRoot from 'find-root';

export const projectRoot = findRoot(__dirname).replace(/\\/g, '/');

export function fullPath(path) {
  return `${projectRoot}/docs/${path}`;
}

const DROWN_PATH = fullPath('drown_events.xlsx');
const COUNTY_CONFIG_PATH = fullPath('countyConfig.json');
const PURPLE_RED_PATH = fullPath('purple_red.xlsx');
const WARNING_RIVERS_PATH = fullPath('warning_rivers.xlsx');

export {
  DROWN_PATH,
  COUNTY_CONFIG_PATH,
  PURPLE_RED_PATH,
  WARNING_RIVERS_PATH,
};

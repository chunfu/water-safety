import axios from 'axios';

async function getRiverConfig() {
  const { data } = await axios.get('/api/places');

  let riverKeys = [];
  const defaultRiverConfig = data.reduce((acc, cur) => {
    const { county, placeName, lat, lng, ...history } = cur;
    riverKeys.push(placeName);
    return {
      ...acc,
      [placeName]: {
        name: placeName,
        county,
        location: [lat, lng],
        history,
      },
    };
  }, {});

  return { defaultRiverConfig, riverKeys };
}

export { getRiverConfig };

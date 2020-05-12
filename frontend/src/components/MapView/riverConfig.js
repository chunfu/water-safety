import axios from 'axios';

async function getRiverConfig() {
  const { data } = await axios.get('/api/places');

  let riverKeys = [];
  const defaultRiverConfig = data.reduce((acc, cur) => {
    const { county, placeName, lat, lng } = cur;
    riverKeys.push(placeName);
    return {
      ...acc,
      [placeName]: {
        name: placeName,
        county,
        location: [lat, lng],
        history: [
          [108, 3, 2],
          [107, 1, 1],
          [106, 3, 1],
          [105, 2, 1],
          [104, 2, 1],
        ],
      },
    };
  }, {});

  return { defaultRiverConfig, riverKeys };
}

export { getRiverConfig };

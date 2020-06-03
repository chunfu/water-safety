import axios from 'axios';

async function getRiverConfig() {
  const { data } = await axios.get('/api/places');

  let riverKeys = [];
  const defaultRiverConfig = data.reduce((acc, cur) => {
    const {
      county,
      placeName,
      lat,
      lng,
      purple,
      yellow,
      red,
      ppoints,
      ypoints,
      rpoints,
      announcement,
      ...history
    } = cur;
    const key = `${county}${placeName}`;
    riverKeys.push(key);
    return {
      ...acc,
      [key]: {
        name: placeName,
        county,
        position: [lat, lng],
        purple,
        yellow,
        red,
        ppoints: ppoints ? ppoints.split(',') : [],
        ypoints: ypoints ? ypoints.split(',') : [],
        rpoints: rpoints ? rpoints.split(',') : [],
        announcement,
        history,
      },
    };
  }, {});

  return { defaultRiverConfig, riverKeys };
}

export { getRiverConfig };

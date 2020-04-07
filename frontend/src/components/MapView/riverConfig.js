const defaultRiverConfig = {
  景美溪: {
    name: '景美溪',
    location: [25.009388, 121.633986],
    history: [
      [108, 2, 1],
      [107, 0, 0],
      [106, 2, 0],
      [105, 1, 0],
      [104, 1, 0],
    ],
  },
  基隆河: {
    name: '基隆河',
    location: [25.023513, 121.728149],
    history: [
      [108, 3, 2],
      [107, 1, 1],
      [106, 3, 1],
      [105, 2, 1],
      [104, 2, 1],
    ],
  },
};

const riverKeys = Object.keys(defaultRiverConfig);

export { defaultRiverConfig, riverKeys };

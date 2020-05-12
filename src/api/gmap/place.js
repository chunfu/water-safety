import * as xlsx from 'xlsx';
import { Client } from '@googlemaps/google-maps-services-js';
import countyNameMapping from './countyNameMapping';
import * as futil from '../../lib/files';
import {
  eventCounty,
  eventLocation,
  eventMonth,
  eventAm,
  eventYear,
  eventTime,
  API_KEY,
} from '../../lib/const';
import { groupBy, uniqBy, get } from 'lodash';

const gmap = new Client();

const excel2json = (path) => {
  const workbook = xlsx.readFile(path);
  const sheets = workbook.SheetNames;
  const sheetsData = sheets.reduce((acc, sheet) => {
    const ws = workbook.Sheets[sheet];
    return {
      ...acc,
      [sheet]: xlsx.utils.sheet_to_json(ws, { raw: false }),
    };
  }, {});

  return sheetsData;
};

const testPlace = [{ county: '台北市', placeName: '淡水河' }];

const getPlaces = (sheetsData) => {
  let places = [];
  Object.keys(sheetsData).forEach((sheetName) => {
    // iterate data from each sheet
    const dataArr = sheetsData[sheetName];
    dataArr.forEach((d) => {
      // iterate each record from data
      if (!d[eventLocation]) return;
      if (d[eventLocation] === '不明') return;
      if (d[eventLocation] === '其它') return;

      const county = countyNameMapping[d[eventCounty]] || d[eventCounty];
      const placeName = d[eventLocation];

      places.push({
        query: `${county}${placeName}`,
        year: sheetName,
        placeName,
        county,
        ...d,
      });
    });
  });

  // { query: [{ placeName, county, year }, ...]}
  let validPlaceObj = groupBy(places, 'query');
  // { query: { year1: x, year2: y, county, placeName }}
  validPlaceObj = Object.keys(validPlaceObj).reduce((acc, key) => {
    const eventsArr = acc[key];
    const { county, placeName } = eventsArr[0];
    let yearObj = groupBy(eventsArr, 'year');
    yearObj = Object.keys(yearObj).reduce(
      (acc, year) => ({ ...acc, [year]: acc[year].length }),
      yearObj,
    );
    return {
      ...acc,
      [key]: {
        county,
        placeName,
        ...yearObj,
      },
    };
  }, validPlaceObj);
  return validPlaceObj;
};

const genPlaceLatLng = async (req, res) => {
  // read excel to json
  const sheetsData = excel2json(futil.DROWN_PATH);

  // get list of places
  const placeObj = getPlaces(sheetsData);

  // get latlng of each place
  const promiseArr = Object.keys(placeObj).map(async (query) => {
    const { placeName, county, ...years } = placeObj[query];
    // google map
    const params = {
      query,
      language: 'zh-TW',
      key: API_KEY,
    };
    const result =
      process.env.debug === 'true'
        ? await Promise.resolve({})
        : await gmap.textSearch({ params });

    const { lat, lng } = get(result, 'data.results[0].geometry.location', {
      lat: '',
      lng: '',
    });

    return {
      county,
      placeName,
      lat,
      lng,
      ...years,
    };
  });
  const locationsWithLatLng = await Promise.all(promiseArr);

  // write into xlsx
  var wb = xlsx.utils.book_new();
  const sheet = xlsx.utils.json_to_sheet(locationsWithLatLng);
  xlsx.utils.book_append_sheet(wb, sheet, 'warning_rivers');
  xlsx.writeFile(wb, futil.WARNING_RIVERS_PATH);

  res.json({
    length: locationsWithLatLng.length,
    file: futil.WARNING_RIVERS_PATH,
  });
};

const getPlaceLatLng = (req, res) => {
  const wb = xlsx.readFile(futil.WARNING_RIVERS_PATH);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const placeList = xlsx.utils.sheet_to_json(sheet);
  res.json(placeList);
};

export { genPlaceLatLng, getPlaceLatLng };

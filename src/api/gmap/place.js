import * as xlsx from 'xlsx';
import { Client } from '@googlemaps/google-maps-services-js';
import * as futil from '../../lib/files';
import {
  eventCounty,
  eventLocation,
  eventMonth,
  API_KEY,
} from '../../lib/const';
import { uniqBy, get } from 'lodash';

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

      places.push({
        county: d[eventCounty],
        placeName: d[eventLocation],
        ...d,
      });
    });
  });

  return uniqBy(places, 'placeName').filter(
    ({ placeName }) => placeName !== '不明' && placeName !== '其它',
  );
};

const genPlaceLatLng = async (req, res) => {
  // read excel to json
  const sheetsData = excel2json(futil.DROWN_PATH);

  // get list of places
  const places =
    process.env.debug === 'true' ? testPlace : getPlaces(sheetsData);

  // get latlng of each place
  const promiseArr = places.map(async ({ county, placeName, ...d }) => {
    // google map
    const params = {
      query: `${county}${placeName}`,
      language: 'zh-TW',
      key: API_KEY,
    };
    const result = await gmap.textSearch({ params });

    const { lat, lng } = get(result, 'data.results[0].geometry.location', {
      lat: '',
      lng: '',
    });

    return {
      county,
      placeName,
      lat,
      lng,
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

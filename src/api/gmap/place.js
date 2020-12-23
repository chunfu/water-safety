import * as fs from 'fs';
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
  purpleRedSheetName,
  redAnnouncementSheetName,
  prCountyCol,
  prPurpleCol,
  prYellowCol,
  prRedCol,
} from '../../lib/const';
import { groupBy, uniq, get } from 'lodash';

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

const normalizeCountyName = (name) => countyNameMapping[name] || name;

const getYellowPlaces = (sheetsData) => {
  let places = [];
  Object.keys(sheetsData).forEach((sheetName) => {
    // iterate data from each sheet
    const dataArr = sheetsData[sheetName];
    dataArr.forEach((d) => {
      // iterate each record from data
      if (!d[eventLocation]) return;
      if (d[eventLocation] === '不明') return;
      if (d[eventLocation] === '其它') return;

      const county = normalizeCountyName(d[eventCounty]);
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
      yearObj
    );
    return {
      ...acc,
      [key]: {
        county,
        placeName,
        yellow: 1, // indicate this is yellow points
        ...yearObj,
      },
    };
  }, validPlaceObj);
  return validPlaceObj;
};

const getPurpleRedPlaces = (sheetsData, placeObj) => {
  // read 總表
  let newPlaceObj = { ...placeObj };
  sheetsData[purpleRedSheetName].forEach((row, j) => {
    const county = normalizeCountyName(row[prCountyCol]);
    const purplePlaceName = (row[prPurpleCol] || '').trim();
    const yellowPlaceName = (row[prYellowCol] || '').trim();
    const redPlaceName = (row[prRedCol] || '').trim();

    // update purple point
    if (purplePlaceName) {
      const query = `${county}${purplePlaceName}`;
      const { ypoints = [], rpoints = [] } = newPlaceObj[query] || {};
      if (yellowPlaceName) ypoints.push(`${county}${yellowPlaceName}`);
      if (redPlaceName) rpoints.push(`${county}${redPlaceName}`);
      newPlaceObj[query] = {
        ...newPlaceObj[query],
        county,
        placeName: purplePlaceName,
        purple: 1,
        ypoints,
        rpoints,
      };
    }

    // update yellow point
    if (yellowPlaceName) {
      const query = `${county}${yellowPlaceName}`;
      const { ppoints = [], rpoints = [] } = newPlaceObj[query] || {};
      if (purplePlaceName) ppoints.push(`${county}${purplePlaceName}`);
      if (redPlaceName) rpoints.push(`${county}${redPlaceName}`);
      newPlaceObj[query] = {
        ...newPlaceObj[query],
        county,
        placeName: yellowPlaceName,
        yellow: 1,
        ppoints,
        rpoints,
      };
    }

    // update red point
    // TODO: read 禁止公告
    if (redPlaceName) {
      const query = `${county}${redPlaceName}`;
      const { ypoints = [], ppoints = [] } = newPlaceObj[query] || {};
      if (yellowPlaceName) ypoints.push(`${county}${yellowPlaceName}`);
      if (purplePlaceName) ppoints.push(`${county}${purplePlaceName}`);
      newPlaceObj[query] = {
        ...newPlaceObj[query],
        county,
        placeName: redPlaceName,
        red: 1,
        ppoints,
        ypoints,
      };
    }
  });

  return newPlaceObj;
};

const genLatLng = async () => {
  // read excel to json
  const sheetsData = excel2json(futil.DROWN_PATH);
  const prSheetsData = excel2json(futil.PURPLE_RED_PATH);

  // get list of places
  let placeObj = getYellowPlaces(sheetsData);
  placeObj = getPurpleRedPlaces(prSheetsData, placeObj);

  // get latlng of each place
  const promiseArr = Object.keys(placeObj).map(async (query) => {
    const {
      placeName,
      county,
      purple,
      yellow,
      red,
      ppoints: ps,
      ypoints: ys,
      rpoints: rs,
      ...years
    } = placeObj[query];
    const ppoints = uniq(ps);
    const ypoints = uniq(ys);
    const rpoints = uniq(rs);

    // if purple = 1, look for ypoints, if no any, try gmap
    // if red = 1, look for ypoints,
    if (purple === 1 || red === 1) {
      // TODO: enhancement to reduce requests to gmap
    }

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
      purple,
      yellow,
      red,
      ppoints: ppoints.join(),
      ypoints: ypoints.join(),
      rpoints: rpoints.join(),
      ...years,
    };
  });
  const locationsWithLatLng = await Promise.all(promiseArr);

  // write into xlsx
  var wb = xlsx.utils.book_new();
  const sheet = xlsx.utils.json_to_sheet(locationsWithLatLng);
  xlsx.utils.book_append_sheet(wb, sheet, 'warning_rivers');
  xlsx.writeFile(wb, futil.WARNING_RIVERS_PATH);
};

const uploadPurpleRed = async (req, res) => {
  const { files } = req;
  try {
    Object.values(files).forEach(
      (f) => f.mv(futil.fullPath(f.name), () => {})
      // f.mv(futil.fullPath(f.name), genLatLng)
    );
    res.json({ ok: 1 });
  } catch (e) {
    console.log(e.stack);
    res.status(500).json({ errMsg: e.message });
  }
};

const uploadCountyPurple = async (req, res) => {
  const { files } = req;
  try {
    Object.values(files).forEach((f) => f.mv(futil.fullPath(f.name), () => {}));
    res.json({ ok: 1 });
  } catch (e) {
    console.log(e.stack);
    res.status(500).json({ errMsg: e.message });
  }
};

const getPlaceLatLng = (req, res) => {
  const wb = xlsx.readFile(futil.WARNING_RIVERS_PATH);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const placeList = xlsx.utils.sheet_to_json(sheet);
  res.json(placeList);
};

const uploadCountyData = (req, res) => {
  const { files } = req;
  try {
    Object.values(files).forEach((f) =>
      f.mv(futil.fullPath(f.name), (err) => {
        const sheetsData = excel2json(futil.DROWN_PATH);
        let countyConfig = {};
        Object.keys(sheetsData).forEach((sheetName) => {
          // iterate data from each sheet
          const dataArr = sheetsData[sheetName];
          dataArr.forEach((d) => {
            // iterate each record from data

            // find the corresponding county config
            const county = normalizeCountyName(d[eventCounty]);

            if (!county) {
              // edge case, print it out
              console.warn(d[eventCounty], d);
              return;
            }

            let config = countyConfig[county] || {};

            // insert current record into county config
            let { accidentData = [] } = config;

            config = {
              ...config,
              accidentData: accidentData.concat(
                makeAccidentData({
                  sheetName,
                  record: d,
                })
              ),
            };

            countyConfig = {
              ...countyConfig,
              [county]: config,
            };
          });
        });
        fs.writeFileSync(
          futil.COUNTY_CONFIG_PATH,
          JSON.stringify(countyConfig),
          'utf8'
        );
      })
    );
    res.json({ ok: 1 });
  } catch (e) {
    console.log(e.stack);
    res.status(500).json({ errMsg: e.message });
  }
};

const makeAccidentData = ({ sheetName, record }) => {
  if (record[eventLocation] === '其它') return [];

  const obj = {
    [eventLocation]: record[eventLocation],
    [eventYear]: sheetName,
    [eventMonth]: record[eventMonth],
    [eventAm]: record[eventAm],
    [eventTime]: record[eventTime],
  };
  return obj;
};

const getCountyData = (req, res) => {
  const countyConfig = JSON.parse(fs.readFileSync(futil.COUNTY_CONFIG_PATH));
  res.json(countyConfig);
};

const getFilesInfo = (req, res) => {
  const drownFile = fs.statSync(futil.DROWN_PATH);
  const purpleRedFile = fs.statSync(futil.PURPLE_RED_PATH);
  const countyPurpleFile = fs.statSync(futil.fullPath('newtaipei.xlsx'));

  res.json({ drownFile, purpleRedFile, countyPurpleFile });
};

const fileMapping = {
  drown: futil.DROWN_PATH,
  purpleRed: futil.PURPLE_RED_PATH,
  countyPurple: futil.fullPath('newtaipei.xlsx'),
};
const downloadFile = (req, res) => {
  const filePath = fileMapping[req.params.fileName];
  res.download(filePath);
};

export {
  uploadPurpleRed,
  uploadCountyPurple,
  getPlaceLatLng,
  uploadCountyData,
  getCountyData,
  getFilesInfo,
  downloadFile,
};

import { version } from '../../package.json';
import { Router } from 'express';
import { upload } from './upload';
import {
  uploadPurpleRed,
  getPlaceLatLng,
  getCountyData,
  uploadCountyData,
  getFilesInfo,
  downloadFile,
} from './gmap/place';
import * as vars from '../lib/const';

const getVariables = (req, res) => {
  res.json(vars);
};

export default ({ config, db }) => {
  let api = Router();

  // mount the facets resource
  // api.use('/facets', facets({ config, db }));

  api.post('/car/upload', upload);
  api.post('/purpleRed', uploadPurpleRed);
  api.get('/places', getPlaceLatLng);
  api.get('/county', getCountyData);
  api.post('/county', uploadCountyData);
  api.get('/vars', getVariables);
  api.get('/files', getFilesInfo);
  api.get('/file/:fileName', downloadFile);

  // perhaps expose some API metadata at the root
  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};

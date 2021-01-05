import { Router } from 'express';
import passport from 'passport';
import { version } from '../../package.json';
import {
  uploadPurpleRed,
  getPlaceLatLng,
  getCountyData,
  uploadCountyData,
  uploadCountyPurple,
  getFilesInfo,
  downloadFile,
} from './gmap/place';
import { login } from './login';
import * as vars from '../lib/const';

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { JWT_SECRET } from '../lib/const';

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    function (jwtPayload, done) {
      return done(null, jwtPayload);
    }
  )
);

const getVariables = (req, res) => {
  res.json(vars);
};

export default ({ config, db }) => {
  let api = Router();

  // mount the facets resource
  // api.use('/facets', facets({ config, db }));

  api.post('/login', login);
  api.get('/vars', getVariables);

  api.post('/logout', (req, res) => {
    req.logout();
    res.json({ logout: 1 });
  })
  api.post('/purpleRed', uploadPurpleRed);
  api.get('/places', getPlaceLatLng);
  api.get('/county', getCountyData);
  api.use(passport.authenticate('jwt', { session: false }));
  api.post('/county', uploadCountyData);
  api.post('/county/:name', uploadCountyPurple);
  api.get('/files', getFilesInfo);
  api.get('/file/:fileName', downloadFile);

  // perhaps expose some API metadata at the root
  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};

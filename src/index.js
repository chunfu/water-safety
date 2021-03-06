import '@babel/polyfill';

import http from 'http';
import express from 'express';
import history from 'connect-history-api-fallback';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

let app = express();
let server = http.createServer(app);
app.server = server;
server.setTimeout(7 * 24 * 60 * 60 * 1000);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: config.corsHeaders,
  }),
);

app.use(
  bodyParser.json({
    limit: config.bodyLimit,
  }),
);

app.use(fileUpload());

// connect to db
initializeDb(db => {
  // internal middleware
  app.use(middleware({ config, db }));

  // api router
  app.use('/api', api({ config, db }));

  app.use(history());

  // serve frontend built files
  app.use(express.static(__dirname + '/build'));

  app.server.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${app.server.address().port}`);
  });
});

export default app;

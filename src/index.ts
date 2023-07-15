import 'reflect-metadata';
import 'module-alias/register';

import express from 'express';
import bodyParser from 'body-parser';
import {ControllersLoader} from 'simple-ts-express-decorators';
import {NsfwController} from 'app/controllers/NsfwController';

const app = express();

app.use(bodyParser.json());

new ControllersLoader({
  controllers: [NsfwController]
}).load(app);

app.listen(3001);

// Fallback
app.all('*', (_, res) => res.redirect('https://chromegle.net/'));

// CORS
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-With');
  res.send(200);
});
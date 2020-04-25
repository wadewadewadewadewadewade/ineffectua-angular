import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

// firebase cloud functions
import * as functions from 'firebase-functions';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'www');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  const cors = require('cors');

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  const originsWhitelist = [
    'http://localhost:4200', // this is my front-end url for development
     'https://ineffectua.web.app'
  ];
  const corsOptions = {
    origin: (origin: string, callback: any) => {
          const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
          callback(null, isWhitelisted);
    },
    credentials: true
  };
  server.use(cors(corsOptions));

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    // res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();

  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
let ssrValue = null;
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
} else if (moduleFilename.includes('firebase-tools')) {
  // https://medium.com/javascript-in-plain-english/deploying-angular-8-universal-app-to-firebase-with-circleci-56b6d83749d1
  // const uni = require(`${process.cwd()}/dist/app-server/main.js`).universal;
  // https://medium.com/angular-in-depth/angular-5-universal-firebase-4c85a7d00862
  ssrValue = functions.runWith({ memory: "2GB", timeoutSeconds: 120 })
    .https.onRequest(app());
}

export let ssr = ssrValue;

export * from './src/main.server';

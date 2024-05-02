import { createRequestHandler } from '@remix-run/express';
import express from 'express';

import * as build from './build/server/index.js';

const port = process.env.PORT || 3000;

const app = express();
app.use(express.static('build/client'));

app.all('*', createRequestHandler({ build }));

// Edgio CLI will automatically call `app.listen()` when running `edgio dev`.
// When this script is called directly (e.g. `npm run build`), automatically start listening on the port.
if (!process.env.EDGIO_LOCAL) {
  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
}

export default app;

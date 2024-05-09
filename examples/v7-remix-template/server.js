import { createRequestHandler } from '@remix-run/express';
import express from 'express';

import * as build from './build/server/index.js';

const port = process.env.PORT || 3000;

const app = express();
app.use(express.static('build/client'));

app.all('*', createRequestHandler({ build }));

app.listen(port, () => {
  console.log(`Express listening on http://localhost:${port}`);
});

export default app;

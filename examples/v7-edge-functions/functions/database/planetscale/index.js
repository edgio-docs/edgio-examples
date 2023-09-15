import { connect } from '@planetscale/database';

// polyfill required classes for Planetscale
import '../../../utils/polyfills/Buffer';
import '../../../utils/polyfills/URL';

import createFetchForOrigin from '../../../utils/createFetchForOrigin';

const fetch = createFetchForOrigin('planetscale');

export async function handleHttpRequest(request, context) {
  // define PLANETSCALE_USERNAME and PLANETSCALE_PASSWORD in a local .env file
  // and in the Edgio Developer Console. Those values will be injected into
  // the `environmentVars` property of the `context` object.
  const { environmentVars: env } = context;

  const config = {
    host: 'aws.connect.psdb.cloud',
    username: env.PLANETSCALE_USERNAME,
    password: env.PLANETSCALE_PASSWORD,
    fetch,
  };

  const conn = connect(config);

  const results = await conn.transaction(async (tx) => {
    await tx.execute('INSERT INTO example_table () VALUES ();');
    return await tx.execute('SELECT COUNT(*) as total FROM example_table;');
  });

  const totalCount = results.rows[0].total;

  const content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Visit Counter</title>
    <style>
        body {
            background-color: #f3f4f6;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-family: 'Courier New', Courier, monospace;
            text-align: center;
            padding: 1rem;
        }
        .counter {
            background-color: #000;
            padding: 5px;
            border-radius: 5px;
            display: inline-block;
            margin-bottom: 1rem;
        }
        .counter .digits {
            display: flex;
            gap: 2px;
        }
        .digit {
            width: 30px;
            height: 50px;
            line-height: 50px;
            font-size: 24px;
            border: 1px solid #fff;
            background-color: #000;
            color: #fff;
            text-align: center;
            font-weight: bold;
            text-shadow: 2px 2px 2px #000;
        }
        .description {
            font-size: 16px;
            max-width: 600px;
        }
    </style>
</head>
<body>
    <div class="counter">
        <div class="digits">
            ${(totalCount + '')
              .padStart(6, '0')
              .split('')
              .map((digit) => `<div class="digit">${digit}</div>`)
              .join('')}
        </div>
    </div>
    <div class="description">
        This example utilizes transactional queries with a PlanetScale database to increment a page counter at the edge.
    </div>
</body>
</html>
`;

  const response = new Response(content, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  });

  return response;
}

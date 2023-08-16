// import { connect } from '@planetscale/database';

// polyfills
// import '../polyfills/Buffer';
// import '../polyfills/URL';
// import createFetch from '../polyfills/fetch';

export async function handleHttpRequest(request, context) {
  const _context = {};

  Object.keys(context).forEach((key) => {
    if (context[key].toJSON && key !== 'environmentVars') {
      _context[key] = context[key].toJSON();
    }
  });

  console.log(_context, request);
  // console.log(JSON.stringify(context, null, 2));
  // const config = {
  //   host: 'aws.connect.psdb.cloud',
  //   username: env.PLANETSCALE_USERNAME,
  //   password: env.PLANETSCALE_PASSWORD,
  //   fetch: createFetch('planetscale'),
  // };

  // const conn = connect(config);

  // const results = await conn.transaction(async (tx) => {
  //   await tx.execute('INSERT INTO example_table () VALUES ();');
  //   return await tx.execute('SELECT COUNT(*) as total FROM example_table;');
  // });

  // const totalCount = results.rows[0].total;

  // const content = JSON.stringify({
  //   message: `Total number of records: ${totalCount}`,
  // });


const response = new Response(JSON.stringify(_context, null, 2), {
  headers: {
    'content-type': 'application/json; charset=utf-8',
  },
});

  response.headers.set(
    'x-custom-header',
    context.geo.get('country') || 'empty'
  );

  context.respondWith(response);
}

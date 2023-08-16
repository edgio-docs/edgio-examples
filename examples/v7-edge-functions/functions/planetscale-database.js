import { connect } from '@planetscale/database';

// polyfills
import '../polyfills/Buffer';
import '../polyfills/URL';
import createFetch from '../polyfills/fetch';

export async function handleHttpRequest(request, context) {
  const env = context.environmentVars;

  const _context = JSON.parse(JSON.stringify(context, null, 2));
  delete _context.environmentVars['__EDGE_FUNCTION_QUICKJS_BYTECODE_BASE64__'];

  console.log('context', JSON.stringify(_context, null, 2));
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

  const content = JSON.stringify(context, null, 2);

  const response = new Response(content, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });

  context.respondWith(response);
}

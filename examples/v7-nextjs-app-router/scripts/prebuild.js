// Workaround for Next.js issue: https://github.com/vercel/next.js/issues/49169#issuecomment-1594504609

const path = require('path');
const fs = require('fs');

const baseDir = process.cwd();

const patchNextRequireHook = async () => {
  const file = path.join(
    baseDir,
    'node_modules',
    'next',
    'dist',
    'server',
    'require-hook.js'
  );

  const content = await fs.promises.readFile(file, 'utf-8');
  await fs.promises.writeFile(
    file,
    content.replace(
      'if (process.env.__NEXT_PRIVATE_PREBUNDLED_REACT) {',
      'if (true) {'
    )
  );
};

patchNextRequireHook();

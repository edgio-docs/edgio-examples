const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

const DATAFILE_DIR = './lib/optimizely';

async function fetchDatafile() {
  const sdkKey = process.env.OPTIMIZELY_SDK_KEY;

  if (!sdkKey) {
    console.error(
      'OPTIMIZELY_SDK_KEY environment variable is required. Skipping datafile fetch.'
    );
    return;
  }

  console.log(`Fetching Optimizely Datafile for SDK Key: ${sdkKey}`);

  const response = await fetch(
    `https://cdn.optimizely.com/datafiles/${sdkKey}.json`
  );
  const responseJson = await response.text();
  if (!fs.existsSync(DATAFILE_DIR)) {
    fs.mkdirSync(DATAFILE_DIR, { recursive: true });
  }
  fs.writeFileSync(`${DATAFILE_DIR}/datafile.json`, responseJson);
  console.log(`Optimizely Datafile fetched successfully`);
}

(async () => {
  await fetchDatafile();
})();

const paths = require('./getExamples')();

console.log(JSON.stringify(paths.filter((path) => path.includes('spartacus'))));

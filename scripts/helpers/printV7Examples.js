const paths = require('./getExamples')();

console.log(JSON.stringify(paths.filter((path) => path.startsWith('v7'))));

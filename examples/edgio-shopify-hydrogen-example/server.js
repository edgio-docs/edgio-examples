const { createServer } = require('./dist/node');

createServer().then(({ app }) => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server ready`);
  });
});

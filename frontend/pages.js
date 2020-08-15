exports.setApp = function (app, path) {
  // home page
  app.get('/', (req, res) => {
    res.sendFile(`${path}/index.html`);
  });
};

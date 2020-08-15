/**
 * This is where the get requests for pages will be stored. Whenever
 * a new page is added. Add a get request for that page. The url for
 * the endpoint is the page url.
 */
exports.setApp = function (app, path) {
  // home page
  app.get('/', (req, res) => {
    res.sendFile(`${path}/index.html`);
  });

  // Send css
  app.get('/index.css', (req, res) => {
    res.sendFile(`${path}/index.css`);
  });

  // Send js
  app.get('/index.js', (req, res) => {
      res.sendFile(`${path}/index.js`);
  });
};

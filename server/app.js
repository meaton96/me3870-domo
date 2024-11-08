require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const favicon = require('serve-favicon');

const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(helmet());
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});

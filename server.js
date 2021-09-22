// package dependencies // 
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');

// creating sequelize storage table // 
const SequelizeStore = require('connection-sessions-sequelize')(session.Store);

// express function // 
const app = express();
const PORT = process.env.PORT || 3001;

// handlebars function //
const hbs = exphbs.create({ helpers });

// save session function // 
const sess = {
  secret: process.env.SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  })
}

// session store as express middleware // 
app.use(session(sess));

// handle bars as default template // 
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// link to html, css, and js // 
app.use(express.static(path.join(__dirname, 'public')));

// use routes // 
app.use(routes);

// start server and to wait for action // 
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});


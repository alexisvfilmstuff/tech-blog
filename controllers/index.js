// server connection // 
const router = require('express').Router();

// api routes folder //
const apiRoutes = require('./api');

// homepage routes //
const homeRoutes = require('./home-routes');

// dashboard routes // 
const dashboardRoutes = require('./dashboard-routes');

// path of homepage // 
router.use('/', homeRoutes);

// path of api routes //
router.use('/api', apiRoutes);

// path of dashboard routes // 
router.use('/dashboard', dashboardRoutes);

// catch all for 404 if nothing exist // 
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router; 
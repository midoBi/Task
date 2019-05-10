const express = require('express');
const taskRoutes = require('./task.route');

const router = express.Router(); // eslint-disable-line new-cap


/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/user', taskRoutes);



module.exports = router;

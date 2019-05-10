const express = require('express');
const asyncHandler = require('express-async-handler');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();
module.exports = router;


router.route('/')
  .post(asyncHandler(insert));


async function insert(req, res) {
  let user = await userCtrl.insert(req.body);
  res.json(user);
}

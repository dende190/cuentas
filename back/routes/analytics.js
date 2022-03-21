const express = require('express');
const jwt = require('jsonwebtoken');
const analyticsService = require('../services/analytics');

function analyticsRoute(app) {
  const router = express.Router();
  app.use('/analitica', router);

  router.post('/deudas', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const billsReport = await analyticsService.getBills(userData.id);
    res.status(200).json(billsReport);
  });
}

module.exports = analyticsRoute;

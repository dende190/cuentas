const express = require('express');
const jwt = require('jsonwebtoken');
const monthlyService = require('../services/monthly');

function monthlyRoute(app) {
  const router = express.Router();
  app.use('/mensualidad', router);

  router.post('/obtener', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const monthlyList = await monthlyService.getAllActives(userData.id);
    res.status(200).json(monthlyList);
  });

  router.post('/gastar', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const spent = await monthlyService.spent(userData.id, req.body.monthlyId);
    res.status(200).json(spent);
  });
}

module.exports = monthlyRoute;

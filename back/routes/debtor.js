const express = require('express');
const jwt = require('jsonwebtoken');
const debtorService = require('../services/debtor');

function debtorRoute(app) {
  const router = express.Router();
  app.use('/cuenta', router);

  router.post('/crear', async (req, res, next) => {
    // if (!req.body.token) {
    //   res.status(301).json({error: true});
    //   return;
    // }
    const newDebtorData = req.body.newDebtor;
    const debtorId = await debtorService.create(newDebtorData.name);
    res.status(200).json(debtorId);
  });
}

module.exports = debtorRoute;

const express = require('express');
const jwt = require('jsonwebtoken');
const billsService = require('../services/bills');

function billsRoute(app) {
  const router = express.Router();
  app.use('/deuda', router);

  router.post('/obtener', async (req, res, next) => {
    // if (!req.body.token) {
    //   res.status(301).json({error: true});
    //   return;
    // }
    const bills = await billsService.get(1);
    res.status(200).json(bills);
  });

  router.post('/crear', async (req, res, next) => {
    // if (!req.body.token) {
    //   res.status(301).json({error: true});
    //   return;
    // }
    const billId = await billsService.create(req.body.bill);
    console.log(billId);
    res.status(200).json(billId);
  });
}

module.exports = billsRoute;

const express = require('express');
const jwt = require('jsonwebtoken');
const debtorService = require('../services/debtor');

function debtorRoute(app) {
  const router = express.Router();
  app.use('/deudor', router);

  router.post('/crear', async (req, res, next) => {
    // if (!req.body.token) {
    //   res.status(301).json({error: true});
    //   return;
    // }
    const debtorData = req.body.debtor;
    const debtorId = await debtorService.create(debtorData.name);
    const debtorInBillId = await (
      debtorService
      .addInBill(debtorId, req.body.billId)
    );
    res.status(200).json(debtorInBillId);
  });
}

module.exports = debtorRoute;

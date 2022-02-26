const express = require('express');
const jwt = require('jsonwebtoken');
const billsService = require('../services/bills');
const debtorService = require('../services/debtor');
const debtorDefault = 'yo';

function billsRoute(app) {
  const router = express.Router();
  app.use('/deuda', router);

  router.post('/obtener', async (req, res, next) => {
    // if (!req.body.token) {
    //   res.status(301).json({error: true});
    //   return;
    // }
    const bills = await billsService.getAllForUser(1);
    res.status(200).json(bills);
  });

  router.post('/crear', async (req, res, next) => {
    // if (!req.body.token) {
    //   res.status(301).json({error: true});
    //   return;
    // }
    const billData = req.body.bill;
    const billId = await billsService.create(billData);
    const debtorId = await debtorService.create(debtorDefault);
    const debtorInBillId = await (
      debtorService
      .addInBill(debtorId, billId, billData.payment, true)
    );

    (
      res
      .status(200)
      .json({
        id: billId,
        description: billData.description,
        payment: billData.payment,
        isPaymentEqual: billData.isPaymentEqual,
        debtors: [{
          id: debtorInBillId,
          name: debtorDefault,
          paid: true,
          expense: billData.payment,
        }],
      })
    );
  });
}

module.exports = billsRoute;

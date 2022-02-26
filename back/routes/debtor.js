const express = require('express');
const jwt = require('jsonwebtoken');
const debtorService = require('../services/debtor');
const billsService = require('../services/bills');

function debtorRoute(app) {
  const router = express.Router();
  app.use('/deudor', router);

  router.post('/crear', async (req, res, next) => {
    // if (!req.body.token) {
    //   res.status(301).json({error: true});
    //   return;
    // }
    const debtorData = req.body.debtor;
    const isPaymentEqual = billsService.isPaymentEqual(req.body.billId);
    const debtorId = await debtorService.create(debtorData.name);
    const debtorInBillId = await (
      debtorService
      .addInBill(debtorId, req.body.billId, (debtorData.expense || 0))
    );
    let expense = [];
    if (isPaymentEqual) {
      expense = await billsService.updateExpenseEqual(req.body.billId);
    }
    res.status(200).json({
      id: debtorId,
      name: debtorData.name.toLowerCase(),
      paid: false,
      expense: expense,
    });
  });
}

module.exports = debtorRoute;

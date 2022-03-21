const express = require('express');
const jwt = require('jsonwebtoken');
const billsService = require('../services/bills');
const debtorService = require('../services/debtor');
const dateFormat = require('../lib/dateFormat');
const debtorDefault = 'yo';

function billsRoute(app) {
  const router = express.Router();
  app.use('/deuda', router);

  router.post('/obtener', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const bills = await billsService.getAllForUser(userData.id);
    res.status(200).json(bills);
  });

  router.post('/crear', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const billData = req.body.bill;
    const userData = jwt.decode(req.body.token);
    const billId = await billsService.create(
      userData.id,
      billData.payment,
      billData.description,
      billData.isPaymentEqual,
      billData.date
    );
    const createdOn = (billData.date || new Date());
    let jsonReturn = {
      id: billId,
      description: billData.description,
      payment: billData.payment,
      isPaymentEqual: billData.isPaymentEqual,
      createdOn: createdOn,
      dateCreatedOn: dateFormat.change(createdOn),
      dateShow: (billData.date === ''),
      debtors: [],
    };

    if (!billData.isPaymentEqual) {
      (
        res
        .status(200)
        .json(jsonReturn)
      );
      return;
    }

    const debtorId = await debtorService.create(debtorDefault);
    const debtorInBillId = await (
      debtorService
      .addInBill(debtorId, billId, billData.payment, true)
    );

    jsonReturn.debtors = [{
      id: debtorInBillId,
      name: debtorDefault,
      paid: true,
      expense: billData.payment,
    }];

    (
      res
      .status(200)
      .json(jsonReturn)
    );
  });
}

module.exports = billsRoute;

const express = require('express');
const jwt = require('jsonwebtoken');
const billsService = require('../services/bills');
const debtorService = require('../services/debtor');
const usersService = require('../services/users');
const monthlyService = require('../services/monthly');
const dateFormat = require('../lib/dateFormat');
const DEBTOR_DEFAULT_NAME = 'yo';

function billsRoute(app) {
  const router = express.Router();
  app.use('/deuda', router);

  router.post('/obtener', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    const billReturn = await (
      billsService
      .getAllForUser(userData.id, req.body.search)
    );
    res.status(200).json(billReturn);
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
      billData.date,
    );
    const createdOn = (billData.date || new Date());
    let bill = {
      id: billId,
      description: billData.description,
      payment: billData.payment,
      paidOut: (billData.isPaymentEqual ? billData.payment : 0),
      isPaymentEqual: billData.isPaymentEqual,
      createdOn: createdOn,
      dateCreatedOn: dateFormat.change(createdOn),
      dateShow: (billData.date === ''),
      debtors: [],
    };

    const monthlyAmount = billData.monthlyAmount;
    if (monthlyAmount) {
      monthlyService.create(billId, monthlyAmount);
    }

    if (!billData.isPaymentEqual) {
      (
        res
        .status(200)
        .json({bill, currentSalaryAndBills: {}})
      );
      return;
    }

    const debtorId = await debtorService.create(DEBTOR_DEFAULT_NAME);
    const debtorInBillId = await (
      debtorService
      .addInBill(debtorId, billId, billData.payment, true)
    );

    const currentSalaryAndBills = await (
      usersService
      .getCurrentSalaryAndBills(userData.id)
    );

    bill.debtors = [{
      id: debtorInBillId,
      name: DEBTOR_DEFAULT_NAME,
      paid: true,
      expense: billData.payment,
    }];

    (
      res
      .status(200)
      .json({bill, currentSalaryAndBills})
    );
  });

  router.post('/eliminar', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const userData = jwt.decode(req.body.token);
    await billsService.delete(userData.id, req.body.billId);
    res.status(200).json({});
  });
}

module.exports = billsRoute;

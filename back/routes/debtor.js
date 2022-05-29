const express = require('express');
const jwt = require('jsonwebtoken');
const debtorService = require('../services/debtor');
const billsService = require('../services/bills');
const usersService = require('../services/users');
const DEBTOR_DEFAULT_ID = 1;

function debtorRoute(app) {
  const router = express.Router();
  app.use('/deudor', router);

  router.post('/crear', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const debtorData = req.body.debtor;
    const billId = req.body.billId;
    const isPaymentEqual = await billsService.isPaymentEqual(billId);
    const debtorId = await debtorService.create(debtorData.name);
    const debtorInBillId = await (
      debtorService
      .addInBill(debtorId, billId, (debtorData.expense || 0))
    );
    let expense = debtorData.expense;
    if (isPaymentEqual) {
      expense = await billsService.updateExpenseEqual(billId);
    }

    res.status(200).json({
      id: debtorInBillId,
      name: debtorData.name.toLowerCase(),
      paid: false,
      expense: expense,
    });
  });

  router.post('/cambiar_estado_de_pago', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const debtorData = req.body;
    await debtorService.changePay(debtorData.debtorInBillId, debtorData.paid);
    const paidOut = await billsService.getPaidOut(req.body.billId);
    const userData = jwt.decode(req.body.token);
    const currentSalaryAndBills = await (
      usersService
      .getCurrentSalaryAndBills(userData.id)
    );
    res.status(200).json({paidOut: (paidOut || 0), currentSalaryAndBills});
  });

  router.post('/eliminar', async (req, res, next) => {
    if (!req.body.token) {
      res.status(301).json({error: true});
      return;
    }

    const billId = await debtorService.delete(req.body.debtorInBillId);
    expense = await billsService.updateExpenseEqual(billId);
    res.status(200).json({expense: expense});
  });
}

module.exports = debtorRoute;

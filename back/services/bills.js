const mysqlLib = require('../lib/mysql');
const dateFormat = require('../lib/dateFormat');

const billsService = {
  isPaymentEqual: async function(billId) {
    const billData = await mysqlLib.selectRow(
      ['is_payment_equal isPaymentEqual'],
      ['bill'],
      [
        ['id', billId],
      ]
    )
    .then(billData => billData)
    .catch(err => console.log(err));

    if (!billData) {
      return;
    }
    return (billData.isPaymentEqual === 1);
  },
  getAllForUser: async function(userId) {
    const bills = await mysqlLib.select(
      [
        'b.id',
        'b.description',
        'b.payment',
        'b.is_payment_equal isPaymentEqual',
        'b.created_on createdOn',
        'd.name debtorName',
        'bd.id debtorInBillId',
        'bd.paid debtorPaid',
        'bd.expense debtorExpense',
      ],
      [
        'bill b',
        'LEFT JOIN bill_debtor bd ON bd.bill_id = b.id AND bd.status = 1',
        'LEFT JOIN debtor d ON d.id = bd.debtor_id',
      ],
      [
        ['b.user_id', userId],
        'AND',
        ['b.status', 1],
      ],
      [
        'ORDER BY b.created_on DESC',
      ]
    )
    .then(bills => bills)
    .catch(err => console.log(err));

    let billsReturn = [];
    let dates = [];
    bills.forEach(bill => {
      if (!billsReturn.find(billReturn => billReturn.id === bill.id)) {
        const createdOn = dateFormat.change(bill.createdOn);
        let dateShow = false;
        if (dates.indexOf(createdOn) === -1) {
          dates.push(createdOn);
          dateShow = true;
        }

        billsReturn.push({
          id: bill.id,
          description: bill.description,
          isPaymentEqual: (bill.isPaymentEqual === 1),
          createdOn: bill.createdOn,
          dateCreatedOn: createdOn,
          dateShow: dateShow,
          payment: bill.payment,
          paidOut: 0,
          debtors: [],
        });
      }

      const billsReturnIndex = (
        billsReturn
        .findIndex(billReturn => billReturn.id === bill.id)
      );
      if (bill.debtorPaid === 1) {
        billsReturn[billsReturnIndex].paidOut += bill.debtorExpense;
      }

      if (!bill.debtorInBillId) {
        return;
      }

      billsReturn[billsReturnIndex].debtors.push({
        id: bill.debtorInBillId,
        name: bill.debtorName,
        paid: bill.debtorPaid,
        expense: bill.debtorExpense
      });
    });

    return billsReturn;
  },
  create: async function(userId, payment, description, isPaymentEqual, date) {
    if (!userId || !description || !payment) {
      return 0;
    }

    const billInsert = {
      user_id: userId,
      description,
      payment,
      payment_type_id: 1,
      is_payment_equal: isPaymentEqual,
    };

    if (date) {
      billInsert['created_on'] = date;
    }

    const billId = await (
      mysqlLib
      .insert(billInsert, 'bill')
      .then(billId => billId)
      .catch(err => console.log(err))
    );

    return (billId || 0);
  },
  updateExpenseEqual: async function(billId) {
    const dataForPayment = await mysqlLib.selectRow(
      [
        'b.payment',
        'COUNT(debtor_id) debtorCount',
      ],
      [
        'bill b',
        'JOIN bill_debtor bd ON bd.bill_id = b.id',
      ],
      [
        ['bd.status', 1],
        'AND',
        ['bd.bill_id', billId],
      ]
    )
    .then(dataForPayment => dataForPayment)
    .catch(err => console.log(err));

    const {payment, debtorCount} = dataForPayment;
    if (!debtorCount) {
      return payment;
    }

    const expensePerDebtor = Math.round(payment / debtorCount);
    await mysqlLib.update(
      {expense: expensePerDebtor},
      [
        ['bill_id', billId],
      ],
      'bill_debtor'
    );

    return expensePerDebtor;
  },
  getPaidOut: async function(billId) {
    const dataForPayment = await mysqlLib.selectRow(
      ['SUM(expense) paidOut'],
      ['bill_debtor'],
      [
        ['status', 1],
        'AND',
        ['paid', 1],
        'AND',
        ['bill_id', billId],
      ]
    )
    .then(dataForPayment => dataForPayment)
    .catch(err => console.log(err));

    return dataForPayment.paidOut;
  },
  delete: async function(userId, billId) {
    if (!userId || !billId) {
      return;
    }

    const a = await mysqlLib.update(
      {status: -1},
      [
        ['id', billId],
        'AND',
        ['user_id', userId],
      ],
      'bill'
    );
  }
};

module.exports = billsService;

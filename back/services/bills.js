const mysqlLib = require('../lib/mysql');

billsService = {
  isPaymentEqual: async function(billId) {
    const billData = await mysqlLib.selectRow(
      ['is_payment_equal isPaymentEqual'],
      ['bill'],
      [
        ['id', '?'],
      ],
      [billId]
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
        ['b.user_id', '?'],
      ],
      [userId],
      [
        'ORDER BY b.id DESC',
      ]
    )
    .then(bills => bills)
    .catch(err => console.log(err));

    let billsReturn = [];
    bills.forEach(bill => {
      if (!billsReturn.find(billReturn => billReturn.id === bill.id)) {
        billsReturn.push({
          id: bill.id,
          description: bill.description,
          isPaymentEqual: (bill.isPaymentEqual === 1),
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
  create: async function(userId, payment, description, isPaymentEqual) {
    if (!userId || !description || !payment) {
      return 0;
    }

    const billId = await mysqlLib.insert(
      {
        user_id: userId,
        description,
        payment,
        payment_type_id: 1,
        is_payment_equal: isPaymentEqual,
      },
      'bill'
    ).then(billId => billId)
    .catch(err => console.log(err));

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
        ['bd.bill_id', '?'],
      ],
      [billId]
    )
    .then(dataForPayment => dataForPayment)
    .catch(err => console.log(err));

    const {payment, debtorCount} = dataForPayment;
    if (!debtorCount) {
      return payment;
    }

    const expensePerDebtor = Math.round(payment / debtorCount);
    await mysqlLib.update(
      'expense = ?',
      expensePerDebtor,
      'bill_id = ?',
      billId,
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
        ['bill_id', '?'],
      ],
      [billId]
    )
    .then(dataForPayment => dataForPayment)
    .catch(err => console.log(err));

    return dataForPayment.paidOut;
  }
};

module.exports = billsService;

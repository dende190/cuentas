const mysqlLib = require('../lib/mysql');

billsService = {
  isPaymentEqual: async function(billId) {
    const billData = await mysqlLib.getRow(
      (
        'SELECT is_payment_equal ' +
        'FROM bill ' +
        'WHERE id = ?'
      ),
      [
        billId
      ]
    ).then(billData => billData)
    .catch(err => console.log(err));

    if (!billData) {
      return;
    }

    return (billData.isPaymentEqual === 1);
  },
  getAllForUser: async function(userId) {
    const bills = await mysqlLib.get(
      (
        'SELECT ' +
          'id, ' +
          'description, ' +
          'payment ' +
        'FROM bill ' +
        'WHERE user_id = ?'
      ),
      [
        userId
      ]
    ).then(bills => bills)
    .catch(err => console.log(err));

    return bills;
  },
  create: async function({payment, description, isPaymentEqual}) {
    if (!description || !payment) {
      return 0;
    }

    const billId = await mysqlLib.insert(
      {
        user_id: 1,
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
    const dataForPayment = await mysqlLib.getRow(
      (
        'SELECT ' +
          'b.payment, ' +
          'COUNT(debtor_id) debtorCount ' +
        'FROM bill b ' +
          'JOIN bill_debtor bd ON bd.bill_id = b.id ' +
        'WHERE ' +
          'bd.status = 1 AND ' +
          'bd.bill_id = ?'
      ),
      [
        billId
      ]
    ).then(dataForPayment => dataForPayment)
    .catch(err => console.log(err));

    const {payment, debtorCount} = dataForPayment;
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
};

module.exports = billsService;

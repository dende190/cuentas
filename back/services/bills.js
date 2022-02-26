const mysqlLib = require('../lib/mysql');

billsService = {
  get: async function(userId) {
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
  }
};

module.exports = billsService;

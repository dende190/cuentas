const mysqlLib = require('../lib/mysql');

debtorService = {
  get: async function(name) {
    const debtor = await mysqlLib.getRow(
      (
        'SELECT id ' +
        'FROM debtor ' +
        'WHERE name = ?'
      ),
      [
        name
      ]
    ).then(debtor => debtor)
    .catch(err => console.log(err));

    return (debtor ? debtor.id : 0);
  },
  create: async function(name) {
    if (!name) {
      return 0;
    }

    const nameLowerCase = name.toLowerCase();
    let debtorId = await this.get(nameLowerCase);
    if (debtorId) {
      return debtorId;
    }

    debtorId = await mysqlLib.insert(
      {
        name: nameLowerCase,
      },
      'debtor'
    ).then(debtorId => debtorId)
    .catch(err => console.log(err));

    return debtorId;
  },
  addInBill: async function(debtorId, billId, expense = 0) {
    if (!debtorId || !billId) {
      return 0;
    }

    const debtorInBill = await mysqlLib.getRow(
      (
        'SELECT id ' +
        'FROM bill_debtor ' +
        'WHERE ' +
          'debtor_id = ? AND ' +
          'bill_id = ?'
      ),
      [
        debtorId,
        billId
      ]
    ).then(debtorInBill => debtorInBill)
    .catch(err => console.log(err));

    if (debtorInBill) {
      return debtorInBill.id;
    }

    const debtorInBillId = await mysqlLib.insert(
      {
        bill_id: billId,
        debtor_id: debtorId,
        expense: expense,
      },
      'bill_debtor'
    ).then(debtorInBillId => debtorInBillId)
    .catch(err => console.log(err));

    return debtorInBillId;
  }
};

module.exports = debtorService;

const mysqlLib = require('../lib/mysql');

const debtorService = {
  get: async function(name) {
    const debtor = await mysqlLib.selectRow(
      ['id'],
      ['debtor'],
      [
        ['name', name],
      ]
    )
    .then(debtor => debtor)
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
  addInBill: async function(debtorId, billId, expense = 0, paid = false) {
    if (!debtorId || !billId) {
      return 0;
    }

    const debtorInBill = await mysqlLib.selectRow(
      [
        'id',
        'status',
      ],
      ['bill_debtor'],
      [
        ['debtor_id', debtorId],
        'AND',
        ['bill_id', billId],
      ]
    )
    .then(debtorInBill => debtorInBill)
    .catch(err => console.log(err));

    if (debtorInBill && debtorInBill.status === 1) {
      return debtorInBill.id;
    } else if (debtorInBill && debtorInBill.status !== 1) {
      await mysqlLib.update(
        {status: 1},
        [
          ['id', debtorInBill.id],
        ],
        'bill_debtor'
      );
      return debtorInBill.id;
    }

    const debtorInBillId = await mysqlLib.insert(
      {
        bill_id: billId,
        debtor_id: debtorId,
        expense: expense,
        paid: paid
      },
      'bill_debtor'
    ).then(debtorInBillId => debtorInBillId)
    .catch(err => console.log(err));

    return debtorInBillId;
  },
  changePay: async function(debtorInBillId, paid) {
    if (!debtorInBillId) {
      return;
    }

    await mysqlLib.update(
      {paid: paid},
      [
        ['id', debtorInBillId]
      ],
      'bill_debtor'
    );
  },
  delete: async function(debtorInBillId) {
    if (!debtorInBillId) {
      return;
    }

    const billData = await mysqlLib.selectRow(
      ['bill_id billId'],
      ['bill_debtor'],
      [
        ['id', debtorInBillId],
      ]
    )
    .then(billData => billData)
    .catch(err => console.log(err));

    await mysqlLib.update(
      {status: -1},
      [
        ['id', debtorInBillId],
      ],
      'bill_debtor'
    );

    return billData.billId;
  }
};

module.exports = debtorService;

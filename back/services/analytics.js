const mysqlLib = require('../lib/mysql');
const dateFormat = require('../lib/dateFormat');

const analyticsService = {
  getBills: async function(userId) {
    if (!userId) {
      return;
    }

    const bills = await mysqlLib.select(
      [
        'b.id',
        'b.description',
        'b.payment',
        'b.is_payment_equal isPaymentEqual',
        'b.created_on createdOn',
        'bd.expense debtorExpense',
        'bd.paid debtorPaid',
        'd.name debtorName',
        'pt.name paymentType',
      ],
      [
        'bill b',
        'JOIN payment_type pt ON pt.id = b.payment_type_id',
        'JOIN bill_debtor bd ON bd.bill_id = b.id',
        'JOIN debtor d ON d.id = bd.debtor_id',
      ],
      [
        ['b.user_id', '?'],
        'AND',
        ['b.status', 1],
        'AND',
        ['bd.status', 1],
      ],
      [userId],
      ['ORDER BY b.created_on DESC'],
    );

    let billsReport = {};
    bills.forEach(bill => {
      const createdOn = dateFormat.change(bill.createdOn);
      if (!billsReport[createdOn]) {
        billsReport[createdOn] = [];
      }

      if (
        !(
          billsReport[createdOn]
          .find(billReport => billReport.id === bill.id)
        )
      ) {
        billsReport[createdOn].push({
          id: bill.id,
          description: bill.description,
          payment: bill.payment,
          paidOut: 0,
          debtors: [],
        });
      }

      const billsReportIndex = (
        billsReport[createdOn]
        .findIndex(billReport => billReport.id === bill.id)
      );

      if (bill.debtorPaid === 1) {
        billsReport[createdOn][billsReportIndex].paidOut += bill.debtorExpense;
      }

      billsReport[createdOn][billsReportIndex].debtors.push({
        name: bill.debtorName,
        paid: bill.debtorPaid,
        expense: bill.debtorExpense
      });
    });

    return billsReport;
  }
};

module.exports = analyticsService

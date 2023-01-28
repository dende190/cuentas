const mysqlLib = require('../lib/mysql');
const dateFormat = require('../lib/dateFormat');

const monthlyService = {
  getAllActives: async function(userId) {
    const monthlyBills = await (
      mysqlLib
      .select(
        [
          'b.description',
          'bm.id',
          'bm.amount',
          'ms.id spentId',
          'ms.spent_on spentOn',
        ],
        [
          'bill b',
          'JOIN bill_monthly bm ON bm.bill_id = b.id',
          (
            'LEFT JOIN monthly_spent ms ON ' +
              'ms.bill_monthly_id = bm.id AND ' +
              'ms.status = 1'
          ),
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
      .then(monthlyBills => monthlyBills)
      .catch(err => console.log(err))
    );

    let monthlyList = [];
    (
      monthlyBills
      .forEach(
        (monthlyBill) => {
          if (!monthlyList.find(monthly => monthly.id === monthlyBill.id)) {
            (
              monthlyList
              .push(
                {
                  id: monthlyBill.id,
                  description: monthlyBill.description,
                  amount: monthlyBill.amount,
                  spents: [],
                }
              )
            );
          }

          if (!monthlyBill.spentId) {
            return;
          }

          const monthlyBillIndex = (
            monthlyList
            .findIndex(monthly => monthly.id === monthlyBill.id)
          );

          const monthly = monthlyList[monthlyBillIndex];
          const spentsAmount = (monthly.spents.length + 1);
          (
            monthly
            .spents
            .push(
              {
                id: monthlyBill.spentId,
                date: dateFormat.change(monthlyBill.spentOn),
                quantity: spentsAmount,
              }
            )
          );

          if (monthly.amount === spentsAmount) {
            monthly.unavailable = true;
          }
        }
      )
    );

    console.log(monthlyList);
    return monthlyList;
  },
  create: async function(billId, amount) {
    const monthlyId = await (
      mysqlLib
      .insert({bill_id: billId, amount}, 'bill_monthly')
      .then(monthlyId => monthlyId)
      .catch(err => console.log(err))
    );
  },
  getMounthlySpentsAmount: async function (userId, monthlyId) {
    return await (
      mysqlLib
      .selectRow(
        ['COUNT(ms.id) spentQuantity', 'bm.amount'],
        [
          'bill b',
          'JOIN bill_monthly bm ON bm.bill_id = b.id',
          'JOIN monthly_spent ms ON ms.bill_monthly_id = bm.id',
        ],
        [
          ['b.user_id', userId],
          'AND',
          ['b.status', 1],
          'AND',
          ['bm.id', monthlyId],
          'AND',
          ['ms.status', 1],
        ],
        [
          'GROUP BY bm.id',
        ]
      )
      .then(mounthlySpentsAmount => mounthlySpentsAmount)
      .catch(err => console.log(err))
    );
  },
  spent: async function(userId, monthlyId) {
    const mounthlySpentsAmount = await (
      this
      .getMounthlySpentsAmount(userId, monthlyId)
    );

    if (
      mounthlySpentsAmount &&
      (mounthlySpentsAmount.amount === mounthlySpentsAmount.spentQuantity)
    ) {
      return {};
    }

    const spentId = await (
      mysqlLib
      .insert({bill_monthly_id: monthlyId}, 'monthly_spent')
      .then(spentId => spentId)
      .catch(err => console.log(err))
    );

    const spentOn = dateFormat.change(new Date());
    const spentQuantity = mounthlySpentsAmount?.spentQuantity;
    return {
      id: spentId,
      date: spentOn,
      quantity: (spentQuantity ? (spentQuantity + 1) : 1),
    }
  }
};

module.exports = monthlyService;

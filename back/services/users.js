const mysqlLib = require('../lib/mysql');
const DEBTOR_DEFAULT_ID = 1;
const PAY_DAY = 30;
const SALARY = 0;
const PERCENTAGE_ALERT_EXPENSE = 70;

const usersService = {
  getConfiguration: async function(userId, returnId = false) {
    const configuration = await mysqlLib.selectRow(
      [
        'id',
        'salary',
        'payday',
        'percentage_alert_expense percentageAlertExpense',
      ],
      ['user_configuration'],
      [
        ['user_id', userId],
      ]
    )
    .then(configurationData => configurationData)
    .catch(err => console.log(err));

    if (returnId) {
      return (configuration ? configuration.id : 0);
    }

    delete configuration.id;
    return configuration;
  },
  saveConfiguration: async function(
    userId,
    salary,
    payday,
    percentageAlertExpense
  ) {
    if (!userId || (!salary && !payday && !percentageAlertExpense)) {
      return;
    }

    let configurationValues = {
      user_id: userId,
    };
    if (salary) {
      configurationValues.salary = salary;
    }

    if (payday) {
      configurationValues.payday = payday;
    }

    if (percentageAlertExpense) {
      configurationValues.percentage_alert_expense = percentageAlertExpense;
    }

    const configurationId = await this.getConfiguration(userId, true)
    if (!configurationId) {
      const userId = await mysqlLib.insert(
        configurationValues,
        'user_configuration'
      ).then(userId => userId)
      .catch(err => console.log(err));

      return configurationValues;
    }

    await mysqlLib.update(
      configurationValues,
      [
        ['id', configurationId]
      ],
      'user_configuration'
    );

    return configurationValues;
  },
  getCurrentSalaryAndBills: async function(userId) {
    const configuration = await this.getConfiguration(userId);
    let payday = PAY_DAY;
    let salary = SALARY;
    let percentageAlertExpense = PERCENTAGE_ALERT_EXPENSE;
    if (configuration) {
      payday = configuration.payday
      salary = configuration.salary
      percentageAlertExpense = configuration.percentageAlertExpense;
    }

    const today = new Date();
    const currentYear = today.getFullYear();
    const lastMonth = (today.getMonth() === 0 ? 12 : today.getMonth());
    const totalBills = await mysqlLib.selectRow(
      [
        (
          'SUM(' +
            'IF(' +
              'bd.debtor_id = ' + DEBTOR_DEFAULT_ID + ' AND bd.paid = 1, ' +
              'bd.expense, ' +
              'IF(' +
                'bd.debtor_id != ' + DEBTOR_DEFAULT_ID + ' AND bd.paid = 0, ' +
                'bd.expense, ' +
                '0' +
              ')' +
            ')' +
          ') totalBills'
        ),
      ],
      [
        'bill_debtor bd',
        'JOIN bill b ON b.id = bd.bill_id'
      ],
      [
        ['bd.status', 1],
        'AND',
        ['b.status', 1],
        'AND',
        [
          'bd.modified_on',
          (
            '"' +
            (
              (lastMonth === 12 ? currentYear - 1 : currentYear) +
              '-' +
              lastMonth +
              '-' +
              payday
            )  +
            '" AND "' +
              (
                currentYear +
                '-' +
                (lastMonth + 1) +
                '-' +
                payday
              ) +
            '"'
          ),
          'BETWEEN',
          false
        ],
      ]
    )
    .then(currentBillsData => currentBillsData.totalBills)
    .catch(err => console.log(err));

    const currentSalary = (salary - totalBills);
    return {
      currentSalary,
      totalBills,
      alertExpense: (
        (salary - (salary * (percentageAlertExpense / 100))) >= currentSalary
      ),
    };
  },
};

module.exports = usersService;

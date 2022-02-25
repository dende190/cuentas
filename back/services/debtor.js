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
  }
};

module.exports = debtorService;

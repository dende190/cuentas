const mysqlLib = require('../lib/mysql');

billsService = {
  create: async function({paid, expanses, name}) {
    if (!expanses || !name) {
      return 0;
    }

    const billId = await mysqlLib.insert(
      {
        title: title,
        content: content,
        user_id: userId,
        image_name: imageName,
      },
      'note'
    ).then(noteId => noteId)
    .catch(err => console.log(err));

    return (noteId || 0);
  }
};

module.exports = billsService;

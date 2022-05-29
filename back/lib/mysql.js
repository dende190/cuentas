const mysql = require('mysql2');
const {config} = require('../config/config');
const USER = encodeURIComponent(config.dbUser);
const PASSWROD = encodeURIComponent(config.dbPassword);
const HOST = encodeURIComponent(config.dbHost);
const NAME = encodeURIComponent(config.dbName);

const mysqlLib = {
  connection: [],
  connect: function() {
    if (this.connection && this.connection.connectionId) {
      return;
    }

    this.connection = mysql.createConnection({
      host: HOST,
      user: USER,
      password: PASSWROD,
      database: NAME,
    });
  },
  query: function(query, row = false) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }

        if (row) {
          return resolve(results[0]);
        }

        resolve(results);
      });
    });
  },
  contructSelect: function(
    columns,
    form,
    wheres = [],
    others = []
  ) {
    let query = 'SELECT ';
    columns.forEach((column, index) => {
      query += (
        column +
        (
          index !== (columns.length - 1) ?
          ',' :
          ''
        ) +
        ' '
      );
    });

    query += 'FROM ';
    form.forEach(value => {
      query += (value + ' ');
    });

    if (wheres.length) {
      query += this.createWhere(wheres);
    }

    if (others.length) {
      others.forEach(other => {
        query += (other + ' ');
      });
    }

    return query;
  },
  select: function(
    columns,
    form,
    wheres = [],
    others = []
  ) {
    const query = this.contructSelect(
      columns,
      form,
      wheres,
      others
    );
    return this.query(query);
  },
  selectRow: function(
    columns,
    form,
    wheres = [],
    others = []
  ) {
    const query = this.contructSelect(
      columns,
      form,
      wheres,
      others
    );
    return this.query(query, true);
  },
  insert: function(values, table) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `INSERT INTO ${table} SET ?`,
        values,
        (err, result) => {
          if (err) {
            return reject(err);
          }

          resolve(result.insertId);
        }
      );
    });
  },
  update: function(set, wheres, table) {
    const query = ('UPDATE ' + table + ' SET ? ' + this.createWhere(wheres));
    return new Promise((resolve, reject) => {
      this.connection.query(
        query,
        [set],
        (err, result) => {
          if (err) {
            return reject(err);
          }

          resolve(result.insertId);
        }
      );
    });
  },
  createWhere: function(wheres) {
    let queryWhere = 'WHERE ';
    wheres.forEach(where => {
      if (!Array.isArray(where)) {
        queryWhere += (where.toUpperCase() + ' ');
        return;
      }

      let condition2 = where[1];
      if (Array.isArray(condition2)) {
        queryWhere += (where[0] + ' IN (');
        condition2.forEach((value, index) => {
          queryWhere += (
            this.connection.escape(value) +
            (
              index !== (condition2.length - 1) ?
              ',' :
              ''
            ) +
            ' '
          );
        });
        queryWhere += ') ';
        return;
      }

      let operator = (where[2] || ' = ');
      if (condition2 !== '?') {
        condition2 = this.connection.escape(condition2);
      }
      queryWhere += (where[0] + operator + condition2 + ' ');
    });
    return queryWhere;
  }
}

try {
  mysqlLib.connect();
} catch(err) {
  console.log(err)
}

module.exports = mysqlLib;

const dateFormat = {
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  change: function(date) {
    const dateOld = new Date(date);
    return (
      dateOld.getDate() +
      ' ' +
      this.months[dateOld.getMonth()] +
      ' ' +
      dateOld.getFullYear()
    );
  },
};

module.exports = dateFormat;

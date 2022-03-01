import {useState} from 'react';
import '../styles/DebtorForm.css'

function DebtorForm({handlerAddDebtor, isPaymentEqual}) {
  const [debtor, setDebtor] = useState({
    expense: '',
    expenseWithDots: '',
    name: '',
  });

  const handlerSubmit = (event) => {
    event.preventDefault();

    handlerAddDebtor({
      paid: false,
      expense: debtor.expense,
      name: debtor.name,
      paidOut: debtor.paidOut,
    });

    setDebtor({
      expense: '',
      expenseWithDots: '',
      name: '',
    });

  };

  const handlerChangeDebtorExpense = (event) => {
    const expense = event.target.value.replaceAll('.', '');
    if (!Number(expense)) {
      return;
    }

    let expenseLength = expense.length;
    let expenseLengthDismiss = expense.length;
    let expenseWithDots = [];
    for (
      let numberIterator = 1;
      numberIterator < expenseLength;
      numberIterator++
    ) {
      if (numberIterator % 3) {
        continue;
      }

      (
        expenseWithDots
        .unshift(
          expense.slice(expenseLength - numberIterator, expenseLengthDismiss)
        )
      );
      expenseLengthDismiss = (expenseLength - numberIterator);
    }
    expenseWithDots.unshift(expense.slice(0, expenseLengthDismiss));
    setDebtor({
      ...debtor,
      expense: expense,
      expenseWithDots: expenseWithDots.join('.'),
    });
  };

  const handlerChangeDebtorName = (event) => {
    setDebtor({
      ...debtor,
      name: event.target.value,
    });
  };

  return (
    <form onSubmit={handlerSubmit}>
      <div className="debtor">
        <div className="debtor_container">
          {
            isPaymentEqual ||
            <input
              type="text"
              min="0"
              className="debtor_input"
              value={debtor.expenseWithDots}
              placeholder="Cuanto debe"
              onChange={handlerChangeDebtorExpense}
            />
          }
          <input
            type="text"
            className="debtor_input"
            value={debtor.name}
            placeholder="Nombre deudor"
            onChange={handlerChangeDebtorName}
          />
          <button
            className="debtor_add"
            disabled={!debtor.name /* || !debtor.expense*/}
          >
            Agregar
          </button>
        </div>
      </div>
    </form>
  );
}

export default DebtorForm;

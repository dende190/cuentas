import {useState} from 'react';
import addDotInNumberText from '../utils/addDotInNumberText';
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

    setDebtor({
      ...debtor,
      expense: expense,
      expenseWithDots: addDotInNumberText(expense),
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
              type="tel"
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

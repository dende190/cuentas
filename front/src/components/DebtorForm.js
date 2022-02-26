import {useState} from 'react';
import '../styles/DebtorForm.css'

function DebtorForm({handlerAddDebtor}) {
  const [debtor, setDebtor] = useState({
    payment: '',
    paymentWithDots: '',
    name: '',
  });

  const handlerSubmit = (event) => {
    event.preventDefault();

    handlerAddDebtor({
      paid: false,
      payment: debtor.payment,
      name: debtor.name,
    });

    setDebtor({
      payment: '',
      paymentWithDots: '',
      name: '',
    });

  };

  const handlerChangeDebtorPayment = (event) => {
    const payment = event.target.value.replaceAll('.', '');
    if (!Number(payment)) {
      return;
    }

    let paymentLength = payment.length;
    let paymentLengthDismiss = payment.length;
    let paymentWithDots = [];
    for (
      let numberIterator = 1;
      numberIterator < paymentLength;
      numberIterator++
    ) {
      if (numberIterator % 3) {
        continue;
      }

      (
        paymentWithDots
        .unshift(
          payment.slice(paymentLength - numberIterator, paymentLengthDismiss)
        )
      );
      paymentLengthDismiss = (paymentLength - numberIterator);
    }
    paymentWithDots.unshift(payment.slice(0, paymentLengthDismiss));
    setDebtor({
      ...debtor,
      payment: payment,
      paymentWithDots: paymentWithDots.join('.'),
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
          {/*<input
            type="text"
            min="0"
            className="debtor_input"
            value={debtor.paymentWithDots}
            onChange={handlerChangeDebtorPayment}
          />*/}
          <input
            type="text"
            className="debtor_input"
            value={debtor.name}
            onChange={handlerChangeDebtorName}
          />
          <button
            className="debtor_add"
            disabled={!debtor.name /* || !debtor.payment*/}
          >
            Agregar
          </button>
        </div>
      </div>
    </form>
  );
}

export default DebtorForm;

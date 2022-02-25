import {useState} from 'react';
import '../styles/DebtorForm.css'

function DebtorForm({handlerAddDebtor}) {
  const [debtor, setDebtor] = useState({
    expanses: '',
    expansesWithDots: '',
    name: '',
  });

  const handlerSubmit = (event) => {
    event.preventDefault();

    handlerAddDebtor({
      paid: false,
      expanses: debtor.expanses,
      name: debtor.name,
    });

    setDebtor({
      expanses: '',
      expansesWithDots: '',
      name: '',
    });

  };

  const handlerChangeDebtorExpanses = (event) => {
    const expanses = event.target.value.replaceAll('.', '');
    if (!Number(expanses)) {
      return;
    }

    let expansesLength = expanses.length;
    let expansesLengthDismiss = expanses.length;
    let expansesWithDots = [];
    for (
      let numberIterator = 1;
      numberIterator < expansesLength;
      numberIterator++
    ) {
      if (numberIterator % 3) {
        continue;
      }

      (
        expansesWithDots
        .unshift(
          expanses.slice(expansesLength - numberIterator, expansesLengthDismiss)
        )
      );
      expansesLengthDismiss = (expansesLength - numberIterator);
    }
    expansesWithDots.unshift(expanses.slice(0, expansesLengthDismiss));
    setDebtor({
      ...debtor,
      expanses: expanses,
      expansesWithDots: expansesWithDots.join('.'),
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
            value={debtor.expansesWithDots}
            onChange={handlerChangeDebtorExpanses}
          />*/}
          <input
            type="text"
            className="debtor_input"
            value={debtor.name}
            onChange={handlerChangeDebtorName}
          />
          <button
            className="debtor_add"
            disabled={!debtor.name /* || !debtor.expanses*/}
          >
            Agregar
          </button>
        </div>
      </div>
    </form>
  );
}

export default DebtorForm;

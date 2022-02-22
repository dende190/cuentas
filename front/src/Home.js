import {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import Header from './components/Header';
import Debtor from './components/Debtor';
import './styles/form.css';
import './styles/Home.css'

function Home() {
  const [debtor, setDebtor] = useState({
    expanses: '',
    expansesWithDots: '',
    name: '',
  });

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
  }

  const handlerChangeDebtorName = (event) => {
    setDebtor({
      ...debtor,
      name: event.target.value,
    });
  }


  return (
    <Fragment>
      <Header />
      <div>
        <h2 className="title">
          Nuevo gasto
        </h2>
        <form method="post">
          <div className="container_expenses_data">
            <input
              type="number"
              min="0"
              name="pagoTotal"
              className="input expanses_data_price"
              placeholder="Cuanto gastaste?"
            />
            <input
              type="text"
              name="pagoDescripcion"
              className="input"
              placeholder="En que lo gastaste?"
            />
            <div>
              <label>
                Gasto dividido por partes iguales:
                <input type="checkbox" name="sameExpenses"/>
              </label>
            </div>
          </div>
        </form>
        <form>
          <div className="debtor_create">
            <input
              type="text"
              min="0"
              className="debtor_create_input"
              value={debtor.expansesWithDots}
              onChange={handlerChangeDebtorExpanses}
            />
            <input
              type="text"
              className="debtor_create_input"
              value={debtor.name}
              onChange={handlerChangeDebtorName}
            />
            <button disabled={!debtor.name || !debtor.expanses}>
              Agregar
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default Home;

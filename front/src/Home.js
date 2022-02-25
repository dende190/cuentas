import {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import Header from './components/Header';
import DebtorForm from './components/DebtorForm';
import DebtorList from './components/DebtorList';
import './styles/form.css';
import './styles/Home.css'

function Home() {
  const [debtorList, setDebtorList] = useState([{
    id: 1,
    paid: false,
    name: 'yo',
  }]);
  const handlerAddDebtor = async (newDebtor) => {
    const debtorIdResponse = await fetch(
      `${process.env.REACT_APP_URL_API}cuenta/crear`,
      {
        method: 'post',
        body: JSON.stringify({newDebtor}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const debtorId = await debtorIdResponse.json();
    if (debtorList.find(debtor => debtor.id === debtorId)) {
      return;
    }

    newDebtor.id = debtorId;
    setDebtorList([...debtorList, newDebtor]);
  };

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
        <DebtorForm handlerAddDebtor={handlerAddDebtor} />
        <DebtorList list={debtorList} setList={setDebtorList} />
      </div>
    </Fragment>
  );
}

export default Home;

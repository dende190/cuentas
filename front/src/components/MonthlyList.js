import {Fragment, useState} from 'react';
import MonthlySpents from './MonthlySpents';
import '../styles/MonthlyList.css'

function MonthlyList({data}) {
  const {
    id,
    description,
    amount,
    spents,
    unavailable,
  } = data;
  const [spentsList, setSpentsList] = useState(spents);
  const [unavailableButton, setUnavailableButton] = (
    useState(unavailable ?? false)
  );

  const handlerSpent = async function () {
    const spentRequest = await fetch(
      `${process.env.REACT_APP_URL_API}mensualidad/gastar`,
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token, monthlyId: id}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const spentReturn = await spentRequest.json();
    if (!Object.values(spentReturn).length) {
      setUnavailableButton(true);
      return;
    }


    if (spentReturn.quantity === amount) {
      setUnavailableButton(true);
    }

    setSpentsList([...spentsList, spentReturn]);
  };

  return (
    <Fragment>
      <div className="monthly_list">
        <h1 className="monthly_list-title">
          {description}
        </h1>
        <div className="monthly_list-amount_container">
          <p className="monthly_list-amount">
            Cantidad: {amount}
          </p>
          <p className="monthly_list-amount_spents">
            Usadas: {spentsList.length}
          </p>
          {
            !unavailableButton &&
            (
              <button className="monthly_list-input" onClick={handlerSpent}>
                Usar
              </button>
            )
          }
        </div>
      </div>
      {
        spentsList &&
        (
          spentsList
          .map(
            (spent) => (
              <MonthlySpents
                key={spent.id}
                spent={spent}
              />
            )
          )
        )
      }
    </Fragment>
  );
}

export default MonthlyList;

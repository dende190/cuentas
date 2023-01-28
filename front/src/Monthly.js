import {Fragment, useState, useEffect} from 'react';
import Header from './components/Header';
import MonthlyList from './components/MonthlyList';
import './styles/Monthly.css';

function Monthly() {
  const [monthlyList, setMonthlyList] = useState([]);
  (
    useEffect(
      async () => {
        const monthlyRequest = await fetch(
          `${process.env.REACT_APP_URL_API}mensualidad/obtener`,
          {
            method: 'post',
            body: JSON.stringify({token: localStorage.token}),
            headers: {
              'Content-Type': 'application/json'
            },
          }
        );

        const monthlyReturn = await monthlyRequest.json();
        setMonthlyList(monthlyReturn);
      },
      []
    )
  );

  return (
    <Fragment>
      <Header />
      <div className="monthly">
        {
          monthlyList ?
          (
            monthlyList
            .map(
              (monthly) =>
              (
                <MonthlyList
                  key={monthly.id}
                  data={monthly}
                />
              )
            )
          ) :
          ('<h3>No hay mensualidades todavia</h3>')
        }
      </div>
    </Fragment>
  );
}

export default Monthly;

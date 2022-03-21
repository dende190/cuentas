import {Fragment, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Header from './components/Header';
import Bill from './components/Bill';
import addDotInNumberText from './utils/addDotInNumberText';
import './styles/form.css';
import './styles/Home.css'

function Home() {
  if (!localStorage.token) {
    window.location.href = '/iniciar_sesion';
  }

  const [billsList, setBillsList] = useState([]);
  const [bill, setBill] = useState({
    payment: '',
    paymentWithDot: '',
    description: '',
    date: '',
    isPaymentEqual: true,
  });
  useEffect(async () => {
    const billsRequest = await fetch(
      `${process.env.REACT_APP_URL_API}deuda/obtener`,
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token, userId: 1}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const billsJson = await billsRequest.json();
    setBillsList(billsJson);
  }, []);

  const handlerSubmitBill = async (event) => {
    event.preventDefault();
    const billDataResponse = await fetch(
      `${process.env.REACT_APP_URL_API}deuda/crear`,
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token, bill}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const billDataJson = await billDataResponse.json();
    const billSort = (
      [billDataJson, ...billsList]
      .sort((after, before) => {
        let afterCreatedOn = after.createdOn;
        let beforeCreatedOn = before.createdOn;

        if (afterCreatedOn > beforeCreatedOn) {
          return -1;
        } else if (afterCreatedOn < beforeCreatedOn) {
          return 1
        }

        return 0;
      })
    );

    setBillsList(billSort);
    setBill({
      payment: '',
      description: '',
      paymentWithDot: '',
      date: '',
      isPaymentEqual: true,
    });
  };

  const handlerChangeBillPayment = (event) => {
    const payment = event.target.value.replaceAll('.', '');
    if (!payment.length) {
      setBill({
        ...bill,
        payment: '',
        paymentWithDot: '',
      });
      return;
    }

    if (!Number(payment)) {
      return;
    }

    setBill({
      ...bill,
      payment: payment,
      paymentWithDot: addDotInNumberText(payment),
    });
  };

  const handlerChangeBillDescription = (event) => {
    setBill({
      ...bill,
      description: event.target.value,
    });
  };

  const handlerChangeBillDate = (event) => {
    setBill({
      ...bill,
      date: event.target.value,
    });
  };

  const handlerChangeBillPaymentEqual = (event) => {
    setBill({
      ...bill,
      'isPaymentEqual': event.target.checked,
    });
  };

  return (
    <Fragment>
      <Header />
      <div>
        <form
          method="post"
          className="container_payment_form"
          onSubmit={handlerSubmitBill}
        >
          <div className="container_payment_data">
            <input
              className="bill_input"
              type="number"
              name="payment"
              placeholder="Cuanto gastaste?"
              value={bill.paymentWithDot}
              onChange={handlerChangeBillPayment}
            />
            <input
              className="bill_input"
              type="text"
              name="description"
              placeholder="En que lo gastaste?"
              value={bill.description}
              onChange={handlerChangeBillDescription}
            />
            <input
              className="bill_input"
              type="date"
              name="date"
              value={bill.date}
              onChange={handlerChangeBillDate}
            />
            <div className="bill_checkbox_container">
              <label>
                Gasto dividido por partes iguales:
                <input
                  className="bill_checkbox"
                  type="checkbox"
                  defaultChecked={bill.isPaymentEqual}
                  onChange={handlerChangeBillPaymentEqual}
                />
              </label>
            </div>
          </div>
          <button className="bill_button">
            Agregar
          </button>
        </form>
        {
          billsList.length ?
          (
            billsList.map(bill => (
              <Bill key={bill.id} data={bill}/>
            ))
          ) :
          (<h3>No hay deudas todavia</h3>)
        }
      </div>
    </Fragment>
  );
}

export default Home;

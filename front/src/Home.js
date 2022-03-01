import {Fragment, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Header from './components/Header';
import Bill from './components/Bill';
import addDotInNumberText from './utils/addDotInNumberText';
import './styles/form.css';
import './styles/Home.css'

function Home() {
  const [billsList, setBillsList] = useState([]);
  const [bill, setBill] = useState({
    payment: '',
    paymentWithDot: '',
    description: '',
    isPaymentEqual: true,
  });
  useEffect(async () => {
    const billsRequest = await fetch(
      `${process.env.REACT_APP_URL_API}deuda/obtener`,
      {
        method: 'post',
        body: JSON.stringify({userId: 1}),
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
        body: JSON.stringify({bill}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const billDataJson = await billDataResponse.json();
    setBillsList([...billsList, billDataJson]);
    setBill({
      payment: '',
      description: '',
      paymentWithDot: '',
      isPaymentEqual: true,
    });
  };

  const handlerChangeBillPayment = (event) => {
    const payment = event.target.value.replaceAll('.', '');
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
    const description = event.target.value;
    setBill({
      ...bill,
      description: description,
    });
  };

  const handlerChangeBillPaymentEqual = (event) => {
    const dBillChecked = event.target;
    setBill({
      ...bill,
      'isPaymentEqual': dBillChecked.checked,
    });
  };

  return (
    <Fragment>
      <Header />
      <div>
        <h2 className="title">
          Nuevo gasto
        </h2>
        <form method="post" onSubmit={handlerSubmitBill}>
          <div className="container_payment_data">
            <input
              type="text"
              name="payment"
              placeholder="Cuanto gastaste?"
              value={bill.paymentWithDot}
              onChange={handlerChangeBillPayment}
            />
            <input
              type="text"
              name="description"
              placeholder="En que lo gastaste?"
              value={bill.description}
              onChange={handlerChangeBillDescription}
            />
            <div>
              <label>
                Gasto dividido por partes iguales:
                <input
                  type="checkbox"
                  defaultChecked={bill.isPaymentEqual}
                  onChange={handlerChangeBillPaymentEqual}
                />
              </label>
            </div>
          </div>
          <button>Agregar</button>
        </form>
        {
          billsList.map(bill => (
            <Bill key={bill.id} data={bill}/>
          ))
        }
      </div>
    </Fragment>
  );
}

export default Home;

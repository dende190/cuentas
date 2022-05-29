import {Fragment, useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import Header from './components/Header';
import Bill from './components/Bill';
import ConfigurationModal from './components/ConfigurationModal';
import addDotInNumberText from './utils/addDotInNumberText';
import './styles/form.css';
import './styles/Home.css'

function Home() {
  if (!localStorage.token) {
    window.location.href = '/iniciar_sesion';
  }
  const billInit = {
    payment: '',
    description: '',
    paymentWithDot: '',
    date: '',
    isPaymentEqual: true,
  };
  const [billsList, setBillsList] = useState([]);
  const [bill, setBill] = useState(billInit);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [configuration, setConfiguration] = useState({
    salary: 0,
    salaryWithDot: '',
    payday: 0,
    percentageAlertExpense: 0,
  });
  const [userCurrentSalaryAndBills, setUserCurrentSalaryAndBills] = (
    useState({
      currentSalary: 0,
      totalBills: 0,
      alertExpense: false,
    })
  );
  const searchInit = {
    name: '',
    withoutPay: false,
    searchOnlyDebtors: false,
  };
  const [search, setSearch] = useState(searchInit);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBill, setTotalBill] = useState(0);
  const dFormSearch = useRef();
  const dFormSearchButtonSubmit = useRef();
  useEffect(async () => {
    const billsRequest = await fetch(
      `${process.env.REACT_APP_URL_API}deuda/obtener`,
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const {billsReturn} = await billsRequest.json();
    setBillsList(billsReturn);

    const userConfigurationRequest = await fetch(
      `${process.env.REACT_APP_URL_API}usuario/obtenerConfiguracion`,
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const userConfigurationJson = await userConfigurationRequest.json();
    if (Object.values(userConfigurationJson).length) {
      setConfiguration({
        ...userConfigurationJson,
        salaryWithDot: addDotInNumberText(userConfigurationJson.salary),
      });
    }

    const userCurrentSalaryAndBillsRequest = await fetch(
      `${process.env.REACT_APP_URL_API}usuario/obtenerSueldosActualYGastos`,
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const userCurrentSalaryAndBillsJson = await (
      userCurrentSalaryAndBillsRequest
      .json()
    );
    setUserCurrentSalaryAndBills(userCurrentSalaryAndBillsJson);
  }, []);

  const handlerSubmitBill = async (event) => {
    event.preventDefault();
    setButtonDisabled(true);
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
    if (search.name) {
      await handlerResetSearch();
    }
    const billSort = (
      [billDataJson.bill, ...billsList]
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
    setBill(billInit);
    setButtonDisabled(false);
    if (Object.values(billDataJson.currentSalaryAndBills).length) {
      setUserCurrentSalaryAndBills(billDataJson.currentSalaryAndBills);
    }
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
      isPaymentEqual: event.target.checked,
    });
  };

  const handlerSubmitSearch = async (event) => {
    event.preventDefault();
    const billsRequest = await fetch(
      `${process.env.REACT_APP_URL_API}deuda/obtener`,
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token, search}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const {billsReturn, totalExpense, totalBill} = await billsRequest.json();
    setBillsList(billsReturn);
    setTotalExpense(totalExpense);
    setTotalBill(totalBill);
  };

  const handlerChangeSearch = (event) => {
    setSearch({
      ...search,
      name: event.target.value,
    });
  };

  const handlerChangeCheckbox = (event) => {
    const dCheckbox = event.target;
    setSearch({
      ...search,
      [dCheckbox.name]: dCheckbox.checked,
    });
  };

  const handlerResetSearch = async () => {
    await setSearch(searchInit);
    dFormSearch.current.reset();
    dFormSearchButtonSubmit.current.click();
  };

  return (
    <Fragment>
      <Header
        showConfiguration={showConfiguration}
        setShowConfiguration={setShowConfiguration}
        userCurrentSalaryAndBills={userCurrentSalaryAndBills}
        totalExpense={totalExpense}
        totalBill={totalBill}
      />
      <div>
        <form
          method="post"
          className="container_payment_form"
          onSubmit={handlerSubmitBill}
        >
          <div className="container_payment_data">
            <input
              className="bill_input"
              type="tel"
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
              className="bill_input date"
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
          <button disabled={buttonDisabled} className="bill_button">
            Agregar
          </button>
        </form>
        <div>
          <form
            method="post"
            className="form_search"
            ref={dFormSearch}
            onSubmit={handlerSubmitSearch}
          >
            <div className="form_search-inputs">
              <input
                className="form_search-input"
                type="search"
                name="search"
                value={search.name}
                placeholder="Buscar..."
                onChange={handlerChangeSearch}
              />
              <div>
                <label className="form_search-checkbox_without_pay">
                  Solo deudas sin pagar
                  <input
                    type="checkbox"
                    name="withoutPay"
                    defaultChecked={search.withoutPay}
                    onChange={handlerChangeCheckbox}
                  />
                </label>
                <label>
                  Solo deudores
                  <input
                    type="checkbox"
                    name="searchOnlyDebtors"
                    defaultChecked={search.searchOnlyDebtors}
                    onChange={handlerChangeCheckbox}
                  />
                </label>
              </div>
            </div>
            <button
              className="form_search-button"
              ref={dFormSearchButtonSubmit}
            >
              Buscar
            </button>
            <button
              type="button"
              className="form_search-button_delete"
              onClick={handlerResetSearch}
            >
              Borrar Filtro
            </button>
          </form>
        </div>
        {
          billsList.length ?
          (
            billsList.map(bill => (
              <Bill
                key={bill.id}
                data={bill}
                setUserCurrentSalaryAndBills={setUserCurrentSalaryAndBills}
              />
            ))
          ) :
          (<h3>No hay deudas todavia</h3>)
        }
      </div>
      <ConfigurationModal
        showConfiguration={showConfiguration}
        setShowConfiguration={setShowConfiguration}
        configuration={configuration}
        setConfiguration={setConfiguration}
      />
    </Fragment>
  );
}

export default Home;

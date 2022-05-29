import {Fragment, useState} from 'react';
import DebtorForm from './DebtorForm';
import DebtorList from './DebtorList';
import Trash from '../img/trash.png';
import '../styles/Bill.css'
import addDotInNumberText from './../utils/addDotInNumberText';

function Bill({data, setUserCurrentSalaryAndBills}) {
  const {
    id,
    description,
    payment,
    debtors,
    isPaymentEqual,
    paidOut,
    dateCreatedOn,
    dateShow,
  } = data;
  const [debtorList, setDebtorList] = useState(debtors);
  const [billPaidOut, setBillPaidOut] = useState(paidOut);
  const handlerAddDebtor = async (debtor) => {
    const debtorResponse = await fetch(
      `${process.env.REACT_APP_URL_API}deudor/crear`,
      {
        method: 'post',
        body: JSON.stringify({token: localStorage.token, billId: id, debtor}),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const newDebtor = await debtorResponse.json();
    if (debtorList.find(debtor => debtor.id === newDebtor.id)) {
      return;
    }

    if (!isPaymentEqual) {
      setDebtorList([...debtorList, newDebtor]);
      return;
    }

    debtorList.forEach((debtor, index) => {
      debtorList[index] = {
        ...debtor,
        expense: newDebtor.expense,
      };
    });

    setDebtorList([...debtorList, newDebtor]);
  };

  const handlerClickBillDelete = async (event) => {
    const billId = event.target.dataset.id;
    const billIdResponse = await fetch(
      `${process.env.REACT_APP_URL_API}deuda/eliminar`,
      {
        method: 'post',
        body: (
          JSON
          .stringify({token: localStorage.token, billId})
        ),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );
    document.querySelector('.jsBill' + billId).remove();
  }

  return (
    <Fragment>
      <h1 className="bill_date">
        {dateShow && dateCreatedOn}
      </h1>
      <div className={`jsBill${id}`}>
        <div className="container_bill">
          <h1 className="bill_title">
            {description}
          </h1>
          <div className="container_bill-payments">
            <p className="bill_payment">
              Total deuda: {addDotInNumberText(payment)}
            </p>
            <p>Total pagado: {addDotInNumberText(billPaidOut)}</p>
            <button
              className="bill_trash"
              data-id={id}
              onClick={handlerClickBillDelete}
            >
              <img src={Trash} data-id={id} onClick={handlerClickBillDelete}/>
            </button>
          </div>
        </div>
        <DebtorForm
          handlerAddDebtor={handlerAddDebtor}
          isPaymentEqual={isPaymentEqual}
        />
        <DebtorList
          billId={id}
          list={debtorList}
          setList={setDebtorList}
          setBillPaidOut={setBillPaidOut}
          setUserCurrentSalaryAndBills={setUserCurrentSalaryAndBills}
        />
      </div>
    </Fragment>
  );
}

export default Bill;

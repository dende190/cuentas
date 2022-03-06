import {Fragment, useState} from 'react';
import DebtorForm from './DebtorForm';
import DebtorList from './DebtorList';

function Bill(props) {
  const {
    id,
    description,
    payment,
    debtors,
    isPaymentEqual,
    paidOut,
  } = props.data;
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

  return (
    <Fragment>
      <div>
        <h3>{description}</h3>
        <p>Total deuda: {payment}</p>
        <p>Total pagado: {billPaidOut}</p>
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
      />
    </Fragment>
  );
}

export default Bill;

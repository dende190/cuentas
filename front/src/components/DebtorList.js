import {useState} from 'react';
import Debtor from './Debtor';
import '../styles/DebtorList.css';

function DebtorList({
  billId,
  list,
  setList,
  setBillPaidOut,
  setUserCurrentSalaryAndBills
}) {
  const handlerChangePaid = async (event) => {
    const dDebtorCheck = event.target;
    const paidOutResponse = await fetch(
      `${process.env.REACT_APP_URL_API}deudor/cambiar_estado_de_pago`,
      {
        method: 'post',
        body: (
          JSON
          .stringify({
            token: localStorage.token,
            debtorInBillId: dDebtorCheck.dataset.id,
            paid: dDebtorCheck.checked,
            billId: billId,
          })
        ),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );
    const paidOutJson = await paidOutResponse.json();
    setBillPaidOut(paidOutJson.paidOut);
    if (Object.values(paidOutJson.currentSalaryAndBills).length) {
      setUserCurrentSalaryAndBills(paidOutJson.currentSalaryAndBills);
    }
  };

  const handlerClickDebtorDelete = async (event) => {
    const dDebtor = event.target;
    const debtorInBillId = dDebtor.dataset.id;
    const newExpenseResponse = await fetch(
      `${process.env.REACT_APP_URL_API}deudor/eliminar`,
      {
        method: 'post',
        body: (
          JSON
          .stringify({token: localStorage.token, debtorInBillId})
        ),
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const newExpenseJson = await newExpenseResponse.json();
    document.querySelector('.jsDebtor' + debtorInBillId).remove();
    list.forEach((debtor, index) => {
      list[index] = {
        ...debtor,
        expense: newExpenseJson.expense,
      };
    });

    setList([...list]);
  };

  return (
    <div className="container_debtor_list">
      {
        list.map(debtor => (
          <Debtor
            key={debtor.id}
            data={debtor}
            handlerChangePaid={handlerChangePaid}
            handlerClickDebtorDelete={handlerClickDebtorDelete}
          />
        ))
      }
    </div>
  );
}

export default DebtorList;
